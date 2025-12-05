/**
 * APPLICATION PRINCIPALE
 * Gestion de l'état et de la navigation
 * 
 * Challenge Decathlon - Nuit de l'Info 2024
 * CTO de Votre Santé Posturale
 */

const App = {
    // État de l'application
    state: {
        currentView: 'landing', // 'landing', 'quiz', 'profile'
        currentQuestion: 0,
        selectedOptions: [],
        answers: {},
        profile: null,
        activeTab: 'overview'
    },
    
    // Élément DOM racine
    root: null,
    
    /**
     * Initialisation de l'application
     */
    init() {
        this.root = document.getElementById('app');
        this.render();
        console.log('🏋️ CTO Posture App initialized');
    },
    
    /**
     * Rendu de l'application
     */
    render() {
        let html = '';
        
        switch (this.state.currentView) {
            case 'landing':
                html = renderLanding();
                break;
            case 'quiz':
                html = renderQuiz(this.state.currentQuestion, this.state.selectedOptions);
                break;
            case 'profile':
                html = renderProfile(this.state.profile, this.state.activeTab);
                break;
        }
        
        this.root.innerHTML = html;
    },
    
    /**
     * Démarrer le quiz
     */
    startQuiz() {
        this.state.currentView = 'quiz';
        this.state.currentQuestion = 0;
        this.state.selectedOptions = [];
        this.state.answers = {};
        this.render();
    },
    
    /**
     * Sélectionner une option
     */
    selectOption(value) {
        const question = QUIZ_QUESTIONS[this.state.currentQuestion];
        
        if (question.multiple) {
            // Gestion multi-sélection
            if (value === 'aucune') {
                // Si "aucune" est sélectionné, désélectionner tout le reste
                this.state.selectedOptions = ['aucune'];
            } else {
                // Retirer "aucune" si une autre option est sélectionnée
                const filtered = this.state.selectedOptions.filter(v => v !== 'aucune');
                
                if (filtered.includes(value)) {
                    // Désélectionner si déjà sélectionné
                    this.state.selectedOptions = filtered.filter(v => v !== value);
                } else {
                    // Ajouter à la sélection
                    this.state.selectedOptions = [...filtered, value];
                }
            }
        } else {
            // Sélection unique
            this.state.selectedOptions = [value];
        }
        
        this.render();
    },
    
    /**
     * Question suivante
     */
    nextQuestion() {
        if (this.state.selectedOptions.length === 0) return;
        
        const question = QUIZ_QUESTIONS[this.state.currentQuestion];
        
        // Sauvegarder la réponse
        this.state.answers[question.category] = question.multiple 
            ? this.state.selectedOptions 
            : this.state.selectedOptions[0];
        
        if (this.state.currentQuestion < QUIZ_QUESTIONS.length - 1) {
            // Passer à la question suivante
            this.state.currentQuestion++;
            this.state.selectedOptions = [];
            this.render();
        } else {
            // Fin du quiz - analyser le profil
            this.showProfile();
        }
    },
    
    /**
     * Question précédente
     */
    prevQuestion() {
        if (this.state.currentQuestion > 0) {
            this.state.currentQuestion--;
            
            // Restaurer la réponse précédente
            const question = QUIZ_QUESTIONS[this.state.currentQuestion];
            const prevAnswer = this.state.answers[question.category];
            
            if (prevAnswer) {
                this.state.selectedOptions = Array.isArray(prevAnswer) ? prevAnswer : [prevAnswer];
            } else {
                this.state.selectedOptions = [];
            }
            
            this.render();
        }
    },
    
    /**
     * Afficher le profil
     */
    showProfile() {
        this.state.profile = analyzeProfile(this.state.answers);
        this.state.currentView = 'profile';
        this.state.activeTab = 'overview';
        this.render();
        
        // Log du profil pour debug
        console.log('📊 Profil généré:', this.state.profile);
    },
    
    /**
     * Changer d'onglet dans le profil
     */
    setTab(tabId) {
        this.state.activeTab = tabId;
        this.render();
    },
    
    /**
     * Recommencer le questionnaire
     */
    restart() {
        this.state.currentView = 'landing';
        this.state.currentQuestion = 0;
        this.state.selectedOptions = [];
        this.state.answers = {};
        this.state.profile = null;
        this.state.activeTab = 'overview';
        this.render();
    }
};

// Démarrage de l'application au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
