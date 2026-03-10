"""
Fix the broken injection from inject_progress_save.py.

The bad injection turned:
  const navigate = useNavigate()
into:
  const navigate = useNavigate
  const { saveResponse } = useProgressSave({ ... })()

This script:
1. Fixes `useNavigate\n  const { saveResponse } = ... })()` -> proper separate lines
2. Ensures useProgressSave hook call doesn't have trailing `()`
"""
import os
import re

FRONTEND_PAGES = 'frontend/src/pages'


def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'useProgressSave' not in content:
        return False

    original = content

    # Fix pattern: useNavigate\n  const { saveResponse } = useProgressSave({...})()\n
    # The bug: useNavigate() became useNavigate (missing parens), and hook got extra ()
    # Pattern 1: `const X = useNavigate\n  const { saveResponse } = useProgressSave({...})()`
    content = re.sub(
        r'(const \w+ = useNavigate)\n(\s+const \{ saveResponse \} = useProgressSave\([^)]+\))\(\)',
        r'\1()\n\2',
        content
    )

    # Fix any remaining useProgressSave(...) with trailing ()
    content = re.sub(
        r'(const \{ saveResponse \} = useProgressSave\(\{[^}]+\}\))\(\)',
        r'\1',
        content
    )

    # Fix useNavigate without () (not followed by ())
    # Only fix if it's `= useNavigate` not `= useNavigate()`
    content = re.sub(
        r'(const \w+ = useNavigate)(?!\(\))',
        r'\1()',
        content
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def main():
    fixed = 0
    for root, dirs, files in os.walk(FRONTEND_PAGES):
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.git', 'dist')]
        for filename in files:
            if not filename.endswith('.jsx'):
                continue
            filepath = os.path.join(root, filename)
            try:
                if fix_file(filepath):
                    fixed += 1
                    print(f"  FIXED: {filepath}")
            except Exception as e:
                print(f"  ERROR {filepath}: {e}")

    print(f"\nFixed {fixed} files")


if __name__ == '__main__':
    main()
