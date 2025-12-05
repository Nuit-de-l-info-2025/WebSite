/**
 * COMPOSANTS UI
 * Génère le HTML pour chaque écran de l'application
 */

// ============================================
// ICÔNES SVG
// ============================================
const ICONS = {
    arrow_right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
    arrow_left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
    check_circle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`
};

// ============================================
// LANDING PAGE
// ============================================
function renderLanding() {
    return `
        <div class="landing">
            <div class="landing-bg">
                <div class="blob blob-1"></div>
                <div class="blob blob-2"></div>
                <div class="grid-pattern"></div>
            </div>
            
            <div class="landing-content fade-in">
                <div class="landing-badge">
                    <div class="logo">D</div>
                    <span>DECATHLON TECH</span>
                </div>
                
                <h1>
                    <span class="gradient-text">CTO</span><br>
                    de Votre Santé<br>
                    <span class="gradient-text-green">Posturale</span>
                </h1>
                
                <p class="landing-subtitle">
                    Connectez l'informatique au sport pour 
                    <span class="highlight">prévenir les blessures</span> 
                    et maîtriser vos mouvements
                </p>
                
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="icon">🎯</div>
                        <h3>Profilage Sportif</h3>
                        <p>QCM personnalisé</p>
                    </div>
                    <div class="feature-card">
                        <div class="icon">🏋️</div>
                        <h3>Exercices Guidés</h3>
                        <p>Mouvements de base</p>
                    </div>
                    <div class="feature-card">
                        <div class="icon">✅</div>
                        <h3>Posture Parfaite</h3>
                        <p>Prévention blessures</p>
                    </div>
                </div>
                
                <button class="btn-primary" onclick="App.startQuiz()">
                    Commencer le Diagnostic
                    ${ICONS.arrow_right}
                </button>
                
                <div class="landing-footer">
                    <span>🌙</span>
                    <span>Nuit de l'Info 2024</span>
                    <span class="dot"></span>
                    <span>Challenge Decathlon</span>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// QUIZ PAGE
// ============================================
function renderQuiz(questionIndex, selectedOptions) {
    const question = QUIZ_QUESTIONS[questionIndex];
    const progress = ((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100;
    const isMultiple = question.multiple;
    const hasSelection = selectedOptions.length > 0;
    const isLastQuestion = questionIndex === QUIZ_QUESTIONS.length - 1;
    
    const optionsHtml = question.options.map(option => {
        const isSelected = selectedOptions.includes(option.value);
        const iconHtml = option.icon ? `<span class="option-icon">${option.icon}</span>` : '';
        
        return `
            <button 
                class="option-btn ${isSelected ? 'selected' : ''}" 
                onclick="App.selectOption('${option.value}')"
            >
                ${iconHtml}
                <div class="option-content">
                    <div class="option-label">
                        ${option.label}
                        <span class="check-icon">${ICONS.check}</span>
                    </div>
                    <div class="option-desc">${option.description}</div>
                </div>
            </button>
        `;
    }).join('');
    
    return `
        <div class="quiz">
            <div class="quiz-header">
                <div class="quiz-header-inner">
                    <div class="progress-info">
                        <span class="question-count">Question ${questionIndex + 1} / ${QUIZ_QUESTIONS.length}</span>
                        <span class="percentage">${Math.round(progress)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="quiz-content">
                <div class="quiz-question slide-left">
                    <div class="question-header">
                        <div class="question-icon">${question.icon}</div>
                        <h2>${question.question}</h2>
                        ${isMultiple ? '<p class="hint">Plusieurs réponses possibles</p>' : ''}
                    </div>
                    
                    <div class="options-grid ${question.options.length > 4 ? 'multi-column' : ''}">
                        ${optionsHtml}
                    </div>
                </div>
            </div>
            
            <div class="quiz-footer">
                <div class="quiz-footer-inner">
                    <button 
                        class="btn-secondary" 
                        onclick="App.prevQuestion()"
                        ${questionIndex === 0 ? 'disabled' : ''}
                    >
                        ${ICONS.arrow_left}
                        Retour
                    </button>
                    
                    <button 
                        class="btn-next" 
                        onclick="App.nextQuestion()"
                        ${!hasSelection ? 'disabled' : ''}
                    >
                        ${isLastQuestion ? 'Voir mon profil' : 'Suivant'}
                        ${ICONS.arrow_right}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// PROFILE PAGE
// ============================================
function renderProfile(profile, activeTab = 'overview') {
    const niveauLabel = LABELS.niveau[profile.niveau] || profile.niveau;
    const objectifLabel = LABELS.objectif[profile.objectif] || profile.objectif;
    
    // Génération des tags sports
    const sportsHtml = profile.sports.length > 0 
        ? profile.sports.map(s => `<span class="tag cyan">${s.charAt(0).toUpperCase() + s.slice(1)}</span>`).join('')
        : '<span style="color: var(--color-text-muted)">Aucun sport sélectionné</span>';
    
    // Génération des tags blessures
    const blessuresFiltered = profile.blessures.filter(b => b !== "aucune");
    const blessuresHtml = blessuresFiltered.length > 0
        ? blessuresFiltered.map(b => `<span class="tag orange">${b.charAt(0).toUpperCase() + b.slice(1)}</span>`).join('')
        : '<span style="color: var(--color-text-muted)">Aucune zone de risque signalée 👍</span>';
    
    // Génération des exercices
    const exercicesHtml = profile.exercicesRecommandes.map(ex => `
        <div class="exercise-card">
            <div class="exercise-icon">${ex.icon}</div>
            <div class="exercise-content">
                <h4>
                    <span class="name">${ex.nom}</span>
                    <span class="badge ${ex.importanceClass}">${ex.importance}</span>
                </h4>
                <p>${ex.description}</p>
            </div>
        </div>
    `).join('');
    
    // Génération des conseils
    const conseilsHtml = profile.conseils.map(c => `
        <div class="tip ${c.type}">
            <span class="icon">${c.icon}</span>
            <div>
                <h4>${c.title}</h4>
                <p>${c.text}</p>
            </div>
        </div>
    `).join('');
    
    // Calcul des cercles de stats
    const circumference = 2 * Math.PI * 35; // r=35
    const statsData = [
        { label: "Niveau", value: profile.stats.scoreNiveau, max: 4, color: "#0082C3" },
        { label: "Posture", value: profile.stats.scorePosture, max: 4, color: profile.risqueColor },
        { label: "Sports", value: profile.stats.nbSports, max: 6, color: "#2A9D8F" },
        { label: "Zones risque", value: profile.stats.nbZonesRisque, max: 5, color: "#E63946", invert: true }
    ];
    
    const statsHtml = statsData.map(stat => {
        const displayValue = stat.invert ? (stat.max - stat.value) : stat.value;
        const dashArray = (displayValue / stat.max) * circumference;
        return `
            <div class="stat-circle">
                <div class="circle">
                    <svg viewBox="0 0 80 80">
                        <circle class="bg" cx="40" cy="40" r="35"/>
                        <circle class="progress" cx="40" cy="40" r="35" 
                            stroke="${stat.color}" 
                            stroke-dasharray="${dashArray} ${circumference}"/>
                    </svg>
                    <span class="value">${stat.value}</span>
                </div>
                <span class="label">${stat.label}</span>
            </div>
        `;
    }).join('');
    
    return `
        <div class="profile">
            <div class="profile-header">
                <div class="profile-header-content">
                    <div class="badge">
                        ${ICONS.check_circle}
                        <span>Analyse complète</span>
                    </div>
                    <h1>Votre Profil Sportif</h1>
                    <p>Basé sur vos réponses au questionnaire</p>
                </div>
            </div>
            
            <div class="profile-content">
                <div class="profile-cards fade-in">
                    <!-- Carte Type de Profil -->
                    <div class="profile-card">
                        <div class="profile-card-header">
                            <div class="profile-card-icon" style="background: ${profile.profilColor}20; border: 2px solid ${profile.profilColor}">
                                ${profile.profilIcon}
                            </div>
                            <div>
                                <div class="label">Type de profil</div>
                                <div class="value">${profile.profilType}</div>
                            </div>
                        </div>
                        <div class="profile-card-stats">
                            <div class="stat-box">
                                <div class="label">Niveau</div>
                                <div class="value">${niveauLabel}</div>
                            </div>
                            <div class="stat-box">
                                <div class="label">Objectif</div>
                                <div class="value">${objectifLabel}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Carte Risque Postural -->
                    <div class="profile-card risk-card">
                        <div class="risk-header">
                            <div>
                                <div class="label" style="color: var(--color-text-muted); font-size: 0.875rem;">Risque Postural</div>
                                <div class="value" style="font-size: 1.75rem; font-weight: 900; color: ${profile.risqueColor}">${profile.risquePostural}</div>
                            </div>
                            <div class="risk-indicator" style="background: ${profile.risqueColor}20; border: 3px solid ${profile.risqueColor}; color: ${profile.risqueColor}">
                                ${profile.risqueIcon}
                            </div>
                        </div>
                        <div class="risk-bar">
                            <div class="bar-header">
                                <span class="label">Score posture</span>
                                <span>${profile.stats.scorePosture}/4</span>
                            </div>
                            <div class="bar">
                                <div class="bar-fill" style="width: ${(profile.stats.scorePosture / 4) * 100}%; background: ${profile.risqueColor}"></div>
                            </div>
                            <div class="note">
                                ${profile.stats.nbZonesRisque > 0 
                                    ? `${profile.stats.nbZonesRisque} zone(s) à surveiller` 
                                    : "Aucune zone de risque identifiée"}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tabs -->
                <div class="tabs">
                    <button class="tab-btn ${activeTab === 'overview' ? 'active' : ''}" onclick="App.setTab('overview')">
                        <span>📊</span> Vue d'ensemble
                    </button>
                    <button class="tab-btn ${activeTab === 'exercises' ? 'active' : ''}" onclick="App.setTab('exercises')">
                        <span>🏋️</span> Exercices
                    </button>
                    <button class="tab-btn ${activeTab === 'tips' ? 'active' : ''}" onclick="App.setTab('tips')">
                        <span>💡</span> Conseils
                    </button>
                </div>
                
                <!-- Tab Content: Overview -->
                <div class="tab-content ${activeTab === 'overview' ? 'active' : ''}" id="tab-overview">
                    <div class="overview-grid">
                        <div class="info-card">
                            <h3><span>🏃</span> Sports pratiqués</h3>
                            <div class="tag-list">${sportsHtml}</div>
                        </div>
                        
                        <div class="info-card">
                            <h3><span>🩹</span> Zones à surveiller</h3>
                            <div class="tag-list">${blessuresHtml}</div>
                        </div>
                        
                        <div class="info-card stats-card">
                            <h3><span>📈</span> Vos statistiques</h3>
                            <div class="stats-grid">${statsHtml}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Tab Content: Exercises -->
                <div class="tab-content ${activeTab === 'exercises' ? 'active' : ''}" id="tab-exercises">
                    <p class="exercises-intro">Exercices recommandés basés sur votre profil :</p>
                    <div class="exercises-list">${exercicesHtml}</div>
                </div>
                
                <!-- Tab Content: Tips -->
                <div class="tab-content ${activeTab === 'tips' ? 'active' : ''}" id="tab-tips">
                    <div class="tips-card">
                        <h3><span>💡</span> Conseils personnalisés</h3>
                        <div class="tips-list">${conseilsHtml}</div>
                    </div>
                </div>
                
                <!-- Restart Button -->
                <div class="restart-section">
                    <button class="btn-restart" onclick="App.restart()">
                        ${ICONS.refresh}
                        Refaire le questionnaire
                    </button>
                </div>
            </div>
        </div>
    `;
}
