/**
 * ANALYSEUR DE PROFIL SPORTIF
 * Génère un profil personnalisé basé sur les réponses au QCM
 */

function analyzeProfile(answers) {
    const sports = answers.sports || [];
    const blessures = answers.blessures || [];
    const niveau = answers.niveau;
    const objectif = answers.objectif;
    const posture = answers.posture;
    
    // ========================================
    // Déterminer le type de profil
    // ========================================
    let profilType = "Équilibré";
    let profilIcon = "⚖️";
    let profilColor = "#0082C3"; // Bleu Decathlon
    
    if (sports.includes("musculation") || sports.includes("combat")) {
        profilType = "Force & Puissance";
        profilIcon = "💪";
        profilColor = "#E63946";
    } else if (sports.includes("cardio") || sports.includes("collectif")) {
        profilType = "Endurance & Cardio";
        profilIcon = "❤️";
        profilColor = "#2A9D8F";
    } else if (sports.includes("flexibility")) {
        profilType = "Souplesse & Mobilité";
        profilIcon = "🧘";
        profilColor = "#9B5DE5";
    }
    
    // ========================================
    // Évaluer le risque postural
    // ========================================
    let risquePostural = "Faible";
    let risqueColor = "#2A9D8F";
    let risqueIcon = "✓";
    
    if (posture === "mauvaise" || blessures.includes("dos")) {
        risquePostural = "Élevé";
        risqueColor = "#E63946";
        risqueIcon = "!";
    } else if (posture === "moyenne" || blessures.filter(b => b !== "aucune").length > 1) {
        risquePostural = "Modéré";
        risqueColor = "#F4A261";
        risqueIcon = "⚠";
    }
    
    // ========================================
    // Générer les exercices recommandés
    // ========================================
    const exercicesRecommandes = [];
    
    // Exercices de base
    exercicesRecommandes.push({
        nom: "Squat",
        importance: blessures.includes("genoux") ? "Technique prioritaire" : "Fondamental",
        importanceClass: blessures.includes("genoux") ? "priority" : "normal",
        icon: "🦵",
        description: "Travaillez la descente contrôlée, genoux alignés avec les orteils. Gardez le dos droit et descendez comme si vous vous asseyiez sur une chaise."
    });
    
    exercicesRecommandes.push({
        nom: "Pompes",
        importance: blessures.includes("epaules") ? "Adaptation nécessaire" : "Fondamental",
        importanceClass: blessures.includes("epaules") ? "adapt" : "normal",
        icon: "💪",
        description: "Gardez le corps gainé, coudes à 45° du corps. Commencez sur les genoux si nécessaire et progressez vers les pompes complètes."
    });
    
    // Exercices spécifiques selon les blessures
    if (blessures.includes("dos") || posture === "mauvaise") {
        exercicesRecommandes.push({
            nom: "Gainage",
            importance: "Prioritaire",
            importanceClass: "priority",
            icon: "🧱",
            description: "Renforcez votre ceinture abdominale pour protéger votre dos. Maintenez la position 30 secondes et augmentez progressivement."
        });
        exercicesRecommandes.push({
            nom: "Cat-Cow Stretch",
            importance: "Quotidien recommandé",
            importanceClass: "priority",
            icon: "🐱",
            description: "Mobilisez votre colonne vertébrale en douceur. Alternez dos rond et dos creux pour améliorer la flexibilité."
        });
    }
    
    if (sports.includes("flexibility") || objectif === "sante") {
        exercicesRecommandes.push({
            nom: "Chien tête en bas",
            importance: "Recommandé",
            importanceClass: "normal",
            icon: "🧘",
            description: "Étirez toute la chaîne postérieure. Cette posture de yoga améliore la flexibilité et renforce les bras."
        });
    }
    
    exercicesRecommandes.push({
        nom: "Fentes",
        importance: "Fondamental",
        importanceClass: "normal",
        icon: "🚶",
        description: "Travaillez l'équilibre et la stabilité des jambes. Gardez le genou avant aligné avec la cheville."
    });
    
    if (blessures.includes("chevilles")) {
        exercicesRecommandes.push({
            nom: "Équilibre unipodal",
            importance: "Recommandé",
            importanceClass: "adapt",
            icon: "🦩",
            description: "Renforcez la stabilité de vos chevilles. Tenez-vous sur un pied 30 secondes de chaque côté."
        });
    }
    
    // ========================================
    // Calculer les statistiques
    // ========================================
    const niveauQuestion = QUIZ_QUESTIONS.find(q => q.category === "niveau");
    const postureQuestion = QUIZ_QUESTIONS.find(q => q.category === "posture");
    
    const scoreNiveau = niveauQuestion.options.find(o => o.value === niveau)?.points || 1;
    const scorePosture = postureQuestion.options.find(o => o.value === posture)?.points || 2;
    
    const stats = {
        scoreNiveau,
        scorePosture,
        nbSports: sports.length,
        nbZonesRisque: blessures.filter(b => b !== "aucune").length
    };
    
    // ========================================
    // Générer les conseils personnalisés
    // ========================================
    const conseils = [];
    
    if (risquePostural !== "Faible") {
        conseils.push({
            type: "warning",
            icon: "⚠️",
            title: "Attention à votre posture",
            text: "Prenez le temps de bien vous échauffer et de travailler votre gainage régulièrement. Consultez un professionnel si les douleurs persistent."
        });
    }
    
    conseils.push({
        type: "info",
        icon: "🎯",
        title: "Qualité avant quantité",
        text: "Concentrez-vous sur l'exécution parfaite des mouvements de base avant d'augmenter les charges ou l'intensité."
    });
    
    conseils.push({
        type: "success",
        icon: "🔄",
        title: "Récupération active",
        text: "Intégrez des séances de mobilité et d'étirements entre vos entraînements pour optimiser la récupération."
    });
    
    conseils.push({
        type: "purple",
        icon: "💧",
        title: "Hydratation",
        text: "Buvez régulièrement avant, pendant et après l'effort pour optimiser vos performances et votre récupération."
    });
    
    if (niveau === "debutant") {
        conseils.push({
            type: "info",
            icon: "📈",
            title: "Progression graduelle",
            text: "Augmentez l'intensité de 10% maximum par semaine. La patience est la clé d'une progression durable sans blessure."
        });
    }
    
    // ========================================
    // Retourner le profil complet
    // ========================================
    return {
        profilType,
        profilIcon,
        profilColor,
        risquePostural,
        risqueColor,
        risqueIcon,
        niveau: niveau || "debutant",
        objectif: objectif || "forme",
        sports,
        blessures,
        exercicesRecommandes,
        conseils,
        stats
    };
}
