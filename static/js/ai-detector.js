// static/js/ai-detector.js

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner le formulaire de réponse
    const responseForm = document.getElementById('responseForm');
    const responseInput = document.getElementById('responseInput');
    
    if (responseForm && responseInput) {
        // Remplacer l'ID du compteur de mots pour qu'il fonctionne avec notre nouveau formulaire
        if (document.getElementById('word-counter')) {
            responseInput.addEventListener('input', function() {
                const words = this.value.split(/\s+/).filter(word => word.length > 0).length;
                document.getElementById('word-counter').textContent = words + ' words';
            });
        }
        
        // Ajouter un écouteur d'événement lors de la soumission du formulaire
        responseForm.addEventListener('submit', function(e) {
            const text = responseInput.value.trim();
            
            // Vérification locale de base pour des indices d'IA
            // Notez que cette vérification est très basique et n'est pas fiable comme l'API
            const aiIndicators = checkForAiIndicators(text);
            
            if (aiIndicators.score > 0.7) {
                // Empêcher la soumission automatique
                e.preventDefault();
                
                // Afficher une boîte de dialogue de confirmation
                if (confirm(`⚠️ ATTENTION ⚠️\n\nVotre réponse présente certaines caractéristiques d'un texte généré par IA:\n\n${aiIndicators.reasons.join('\n')}\n\nNous encourageons les réponses originales et personnelles.\n\nVoulez-vous quand même soumettre cette réponse?`)) {
                    // Si l'utilisateur confirme, soumettre le formulaire
                    responseForm.submit();
                }
            }
        });
    }
});

/**
 * Effectue une vérification basique côté client pour des indices de texte généré par IA.
 * Cette fonction est uniquement destinée à l'UX et n'est pas destinée à remplacer 
 * la vérification plus sophistiquée effectuée côté serveur.
 */
function checkForAiIndicators(text) {
    const reasons = [];
    let score = 0;
    
    // Texte trop court pour l'analyse
    if (text.length < 50) {
        return { score: 0, reasons: [] };
    }
    
    // 1. Vérifier la longueur (les réponses IA tendent à être longues et élaborées)
    if (text.length > 500) {
        reasons.push("La réponse est inhabituellement longue");
        score += 0.1;
    }
    
    // 2. Vérifier les formulations typiques des IA
    const aiPhrases = [
        "en tant que", "je suis heureux de", "je suis ravi de", "il est important de noter que",
        "il convient de souligner", "comme mentionné précédemment", "pour résumer", 
        "en conclusion", "je n'ai pas accès à", "je ne peux pas", "en effet,", "par conséquent,"
    ];
    
    let phrasesFound = 0;
    aiPhrases.forEach(phrase => {
        if (text.toLowerCase().includes(phrase.toLowerCase())) {
            phrasesFound++;
        }
    });
    
    if (phrasesFound >= 2) {
        reasons.push(`Contient ${phrasesFound} expressions souvent utilisées par les IA`);
        score += 0.25 * Math.min(phrasesFound / 3, 1); // Plafond à 0.25
    }
    
    // 3. Vérifier la structure trop parfaite (paragraphes, ponctuation)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = text.length / Math.max(sentences.length, 1);
    
    // Les phrases des IA ont souvent une longueur constante
    const sentenceLengths = sentences.map(s => s.length);
    const stdDeviation = calculateStdDeviation(sentenceLengths);
    const variationCoeff = stdDeviation / Math.max(avgSentenceLength, 1);
    
    if (variationCoeff < 0.4 && sentences.length > 3) {
        reasons.push("La structure des phrases est inhabituellement régulière");
        score += 0.2;
    }
    
    // 4. Vérifier la diversité du vocabulaire (trop élevée pour un humain sous pression)
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const uniqueWords = new Set(words);
    const lexicalDiversity = uniqueWords.size / Math.max(words.length, 1);
    
    if (lexicalDiversity > 0.8 && words.length > 30) {
        reasons.push("La diversité du vocabulaire est inhabituellement élevée");
        score += 0.15;
    }
    
    // Réduire légèrement le score pour les réponses très courtes (< 200 caractères)
    // car l'analyse est moins fiable
    if (text.length < 200) {
        score *= 0.7;
    }
    
    return {
        score: Math.min(score, 1), // Plafonner à 1
        reasons: reasons
    };
}

/**
 * Calcule l'écart-type d'un ensemble de nombres
 */
function calculateStdDeviation(values) {
    if (values.length < 2) return 0;
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => {
        const diff = value - avg;
        return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
}