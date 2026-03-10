"""
Auto-inject useProgressSave hook into all Interaction and Task JSX files.

Strategy:
- Detects phase/subphase/step/interaction from the file path
- Adds import if not present
- Adds hook instantiation inside the component (after first useState/useNavigate)
- Adds saveResponse() call inside logTaskCompletion() or handleGameComplete()

Run from project root:
  python inject_progress_save.py
"""
import os
import re

FRONTEND_PAGES = 'frontend/src/pages'

IMPORT_LINE = "import { useProgressSave } from "


def get_hook_import(depth):
    """Return correct relative import based on folder depth from pages/"""
    dots = '../' * depth
    return f"import {{ useProgressSave }} from '{dots}../hooks/useProgressSave'"


def parse_phase_info(filepath):
    """
    Parse phase, subphase, step, interaction, context from file path.
    Returns dict or None if can't parse.
    """
    # Normalize path separators
    parts = filepath.replace('\\', '/').split('/')

    # Find the pages directory
    try:
        pages_idx = next(i for i, p in enumerate(parts) if p == 'pages')
    except StopIteration:
        return None

    rel_parts = parts[pages_idx + 1:]  # e.g. ['Phase3', 'Step1', 'Interaction1.jsx']
    if not rel_parts:
        return None

    phase_folder = rel_parts[0]  # e.g. 'Phase3', 'Phase4Step1', 'Phase5SubPhase1Step1'

    # Determine context from path
    context = 'main'
    remedial_match = re.search(r'Remedial([A-C][12]?)', filepath, re.IGNORECASE)
    if remedial_match:
        level = remedial_match.group(1).lower()
        context = f'remedial_{level}'

    # Parse phase number
    phase_match = re.search(r'Phase(\d+)', phase_folder)
    if not phase_match:
        return None
    phase = int(phase_match.group(1))

    # Parse subphase
    subphase = None
    sp_match = re.search(r'SubPhase(\d+)', phase_folder)
    if sp_match:
        subphase = int(sp_match.group(1))

    # Parse step
    step = 1
    # Check folder name for step
    step_match = re.search(r'Step(\d+)', phase_folder)
    if step_match:
        step = int(step_match.group(1))
    elif len(rel_parts) > 1:
        step_match = re.search(r'Step(\d+)', rel_parts[1])
        if step_match:
            step = int(step_match.group(1))

    # Parse interaction (from filename)
    interaction = 1
    filename = rel_parts[-1]
    int_match = re.search(r'Interaction(\d+)', filename)
    if int_match:
        interaction = int(int_match.group(1))
    # Task files: use task letter as interaction identifier (A=1, B=2, etc.)
    task_match = re.search(r'Task([A-Z])', filename)
    if task_match:
        task_letter = task_match.group(1)
        interaction = ord(task_letter) - ord('A') + 1

    # Depth = number of folders between pages/ and the file
    depth = len(rel_parts) - 1  # subtract filename

    return {
        'phase': phase,
        'subphase': subphase,
        'step': step,
        'interaction': interaction,
        'context': context,
        'depth': depth,
    }


def hook_call(info):
    """Return the hook instantiation line."""
    subphase_str = str(info['subphase']) if info['subphase'] else 'null'
    return (
        f"  const {{ saveResponse }} = useProgressSave({{ "
        f"phase: {info['phase']}, subphase: {subphase_str}, "
        f"step: {info['step']}, interaction: {info['interaction']}, "
        f"context: '{info['context']}' }})"
    )


def inject_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    info = parse_phase_info(filepath)
    if not info:
        print(f"  SKIP (can't parse phase info): {filepath}")
        return False

    # Skip if already injected
    if 'useProgressSave' in content:
        print(f"  SKIP (already has hook): {filepath}")
        return False

    import_line = get_hook_import(info['depth'])
    hook_line = hook_call(info)

    # 1. Add import after the last existing import line
    import_block_end = 0
    for m in re.finditer(r'^import .+$', content, re.MULTILINE):
        import_block_end = m.end()

    if import_block_end == 0:
        print(f"  SKIP (no imports found): {filepath}")
        return False

    content = content[:import_block_end] + '\n' + import_line + content[import_block_end:]

    # 2. Add hook call inside the component function
    # Find the component function body — look for export default function or const X = () =>
    # Insert after the first useState/useNavigate/useLocation line inside component
    component_patterns = [
        r'(export default function \w+\(\)[^{]*\{)',
        r'(export default function \w+\([^)]*\)[^{]*\{)',
        r'(const \w+ = \(\) => \{)',
        r'(const \w+ = \([^)]*\) => \{)',
    ]

    inserted = False
    for pattern in component_patterns:
        m = re.search(pattern, content)
        if not m:
            continue
        # Find insertion point: after first hook call (useState/useNavigate/useRef/useEffect) inside component
        search_start = m.end()
        hook_usage = re.search(
            r'(const \{[^}]+\} = use\w+|const \[\w+.*?\] = useState|const \w+ = useNavigate)',
            content[search_start:search_start + 2000]
        )
        if hook_usage:
            insert_at = search_start + hook_usage.end()
            content = content[:insert_at] + '\n' + hook_line + content[insert_at:]
            inserted = True
            break

    if not inserted:
        print(f"  SKIP (couldn't find insertion point): {filepath}")
        return False

    # 3. Inject saveResponse call inside logTaskCompletion or handleGameComplete
    # We add a saveResponse call at the START of logTaskCompletion / handleGameComplete
    # to capture the completion event with the score

    # Pattern: find logTaskCompletion or handleGameComplete function body
    completion_fn_patterns = [
        r'(const logTaskCompletion = async \([^)]*\) => \{)',
        r'(const logTaskCompletion = \([^)]*\) => \{)',
        r'(const logTaskCompletion = async function[^{]*\{)',
        r'(const handleGameComplete = \([^)]*\) => \{)',
        r'(const handleGameComplete = async \([^)]*\) => \{)',
    ]

    for pattern in completion_fn_patterns:
        m = re.search(pattern, content)
        if m:
            # Extract parameter name (score variable)
            param_str = m.group(1)
            params_match = re.search(r'\(([^)]*)\)', param_str)
            params = params_match.group(1).strip() if params_match else ''

            # Build a generic saveResponse call
            # Use first param as score if available
            first_param = params.split(',')[0].strip() if params else 'score'
            save_call = (
                f"\n    saveResponse({{ item_index: 0, item_id: 'completion', "
                f"item_type: 'task_complete', prompt: 'Task completion', "
                f"answer: {repr(filepath.split('/')[-1].replace('.jsx', ''))}, "
                f"is_correct: true, score: {first_param} }})"
            )
            insert_at = m.end()
            content = content[:insert_at] + save_call + content[insert_at:]
            break

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  INJECTED: {filepath}")
    return True


def main():
    injected = 0
    skipped = 0
    errors = 0

    for root, dirs, files in os.walk(FRONTEND_PAGES):
        # Skip node_modules etc
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.git', 'dist')]

        for filename in files:
            if not filename.endswith('.jsx'):
                continue
            # Only process Interaction*.jsx and Task*.jsx files
            if not (filename.startswith('Interaction') or filename.startswith('Task')):
                continue

            filepath = os.path.join(root, filename)
            try:
                result = inject_file(filepath)
                if result:
                    injected += 1
                else:
                    skipped += 1
            except Exception as e:
                print(f"  ERROR {filepath}: {e}")
                errors += 1

    print(f"\nDone: {injected} injected, {skipped} skipped, {errors} errors")


if __name__ == '__main__':
    main()
