/**
 * DONNÉES DU QCM - Profilage Sportif
 * Challenge Decathlon - Nuit de l'Info 2024
 */

const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "Quel est votre niveau sportif actuel ?",
        icon: "🎯",
        category: "niveau",
        multiple: false,
        options: [
            { value: "debutant", label: "Débutant", description: "Je débute ou reprends le sport", points: 1 },
            { value: "intermediaire", label: "Intermédiaire", description: "Je pratique régulièrement depuis quelques mois", points: 2 },
            { value: "avance", label: "Avancé", description: "Je m'entraîne plusieurs fois par semaine depuis des années", points: 3 },
            { value: "expert", label: "Expert / Compétiteur", description: "Je participe à des compétitions", points: 4 }
        ]
    },
    {
        id: 2,
        question: "À quelle fréquence pratiquez-vous une activité sportive ?",
        icon: "📅",
        category: "frequence",
        multiple: false,
        options: [
            { value: "rare", label: "Rarement", description: "Moins d'une fois par semaine", points: 1 },
            { value: "occasionnel", label: "Occasionnel", description: "1-2 fois par semaine", points: 2 },
            { value: "regulier", label: "Régulier", description: "3-4 fois par semaine", points: 3 },
            { value: "intensif", label: "Intensif", description: "5+ fois par semaine", points: 4 }
        ]
    },
    {
        id: 3,
        question: "Quels types de sports pratiquez-vous ?",
        icon: "🏃",
        category: "sports",
        multiple: true,
        options: [
            { value: "cardio", label: "Cardio", description: "Course, vélo, natation...", icon: "🏃" },
            { value: "musculation", label: "Musculation", description: "Fitness, crossfit, haltérophilie...", icon: "🏋️" },
            { value: "flexibility", label: "Souplesse", description: "Yoga, pilates, stretching...", icon: "🧘" },
            { value: "collectif", label: "Sports collectifs", description: "Football, basket, handball...", icon: "⚽" },
            { value: "raquette", label: "Sports de raquette", description: "Tennis, badminton, padel...", icon: "🎾" },
            { value: "combat", label: "Sports de combat", description: "Boxe, judo, MMA...", icon: "🥊" }
        ]
    },
    {
        id: 4,
        question: "Avez-vous des douleurs ou gênes récurrentes ?",
        icon: "🩹",
        category: "blessures",
        multiple: true,
        options: [
            { value: "aucune", label: "Aucune", description: "Je n'ai pas de douleur particulière", icon: "✅" },
            { value: "dos", label: "Dos", description: "Lombaires, dorsales, cervicales", icon: "🔙" },
            { value: "genoux", label: "Genoux", description: "Douleurs articulaires aux genoux", icon: "🦵" },
            { value: "epaules", label: "Épaules", description: "Douleurs ou raideurs aux épaules", icon: "💪" },
            { value: "chevilles", label: "Chevilles", description: "Entorses fréquentes ou instabilité", icon: "🦶" },
            { value: "hanches", label: "Hanches", description: "Douleurs ou manque de mobilité", icon: "🏃" }
        ]
    },
    {
        id: 5,
        question: "Quel est votre objectif principal ?",
        icon: "🎯",
        category: "objectif",
        multiple: false,
        options: [
            { value: "forme", label: "Rester en forme", description: "Maintenir une bonne condition physique", points: 1 },
            { value: "perte_poids", label: "Perdre du poids", description: "Améliorer ma composition corporelle", points: 2 },
            { value: "muscle", label: "Gagner en muscle", description: "Développer ma masse musculaire", points: 3 },
            { value: "performance", label: "Performance", description: "Améliorer mes performances sportives", points: 4 },
            { value: "sante", label: "Santé / Rééducation", description: "Prévenir ou récupérer de blessures", points: 2 }
        ]
    },
    {
        id: 6,
        question: "Combien de temps pouvez-vous consacrer à un entraînement ?",
        icon: "⏱️",
        category: "duree",
        multiple: false,
        options: [
            { value: "court", label: "15-30 minutes", description: "Sessions courtes et intenses", points: 1 },
            { value: "moyen", label: "30-45 minutes", description: "Sessions modérées", points: 2 },
            { value: "long", label: "45-60 minutes", description: "Sessions complètes", points: 3 },
            { value: "tres_long", label: "60+ minutes", description: "Sessions longues et détaillées", points: 4 }
        ]
    },
    {
        id: 7,
        question: "Où préférez-vous vous entraîner ?",
        icon: "🏠",
        category: "lieu",
        multiple: true,
        options: [
            { value: "maison", label: "À la maison", description: "Sans équipement ou équipement minimal", icon: "🏠" },
            { value: "salle", label: "En salle", description: "Avec accès à des machines et poids", icon: "🏋️" },
            { value: "exterieur", label: "En extérieur", description: "Parcs, terrains, nature", icon: "🌳" },
            { value: "piscine", label: "Piscine", description: "Natation et aquagym", icon: "🏊" }
        ]
    },
    {
        id: 8,
        question: "Comment évaluez-vous votre posture au quotidien ?",
        icon: "🧍",
        category: "posture",
        multiple: false,
        options: [
            { value: "mauvaise", label: "Mauvaise", description: "Je suis souvent voûté(e) ou mal positionné(e)", points: 1 },
            { value: "moyenne", label: "Moyenne", description: "Je fais attention mais j'oublie souvent", points: 2 },
            { value: "bonne", label: "Bonne", description: "Je maintiens généralement une bonne posture", points: 3 },
            { value: "excellente", label: "Excellente", description: "Je travaille activement ma posture", points: 4 }
        ]
    }
];

// Labels pour l'affichage
const LABELS = {
    niveau: {
        debutant: "Débutant",
        intermediaire: "Intermédiaire",
        avance: "Avancé",
        expert: "Expert"
    },
    objectif: {
        forme: "Rester en forme",
        perte_poids: "Perte de poids",
        muscle: "Gain musculaire",
        performance: "Performance",
        sante: "Santé / Rééducation"
    }
};
