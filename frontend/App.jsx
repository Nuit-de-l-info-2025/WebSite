import React, { useState, useRef, useEffect } from 'react';
import { X, BookOpen, MessageCircle, User } from 'lucide-react'; 
// IMPORT DU NOUVEAU COMPOSANT CHAT
import ChatScreen from './ChatScreen'; 
// NOUVEL IMPORT POUR LA PAGE DE PARAMÈTRES
import AccessibilitySettings from './AccessibilitySettings'; 

// CONSTANTE FIXE : Nom de l'équipe pour le prompt du Terminal
const LOGIN_NAME = 'nuit-de-l-apero'; 
const SECRET_COMMAND = 'login hack';

const UbuntuDesktop = () => {
    // --- États du Composant ---
    const [currentPage, setCurrentPage] = useState('home');
    const [commandHistory, setCommandHistory] = useState([
        `Welcome to Ubuntu 22.04 LTS`,
        '',
    ]);
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]); 
    const [isAccessGranted, setIsAccessGranted] = useState(true); 

    const [showTerminal, setShowTerminal] = useState(false);
    // L'état pour le manuel
    const [showManual, setShowManual] = useState(false); 
    
    // L'état est conservé pour contrôler l'affichage
    const [showSettings, setShowSettings] = useState(false);
    const [userName, setUserName] = useState('maelh'); 
    const [settingsInput, setSettingsInput] = useState('maelh'); 
    
    // NOUVEL ÉTAT POUR LE MODE ROOT
    const [isRoot, setIsRoot] = useState(false); 
    
    // NOUVEAUX ÉTATS D'ACCESSIBILITÉ
    const [fontSize, setFontSize] = useState('normal'); 
    const [highContrast, setHighContrast] = useState(false);
    const [systemSounds, setSystemSounds] = useState(true); 
    const [reducedMotion, setReducedMotion] = useState(false); 
    const [largeCursor, setLargeCursor] = useState(false);
    
    const terminalEndRef = useRef(null);
    
    const [showFileContent, setShowFileContent] = useState(false);
    const [fileContent, setFileContent] = useState('');

    const API_URL = 'http://localhost:5000/api';

    // Définitions des pages (home, chat, projets, equipe)
    const pages = {
        home: { name: 'home', title: 'Accueil' },
        chat: { name: 'chat', title: 'Chat' },
        projets: { name: 'projets', title: 'Projets' },
        equipe: { name: 'equipe', title: 'Équipe' }
    };

    // ... (Reste des définitions de commandes et fichiers - Inchangé)

    const availableCommands = ['help', 'ls', 'cd', 'cat', 'whoami', 'clear', 'echo', 'man', 'su', 'exit']; 
    
    const files = {
        'equipe.txt': `
Nom du Projet : Nuit de l'Apéro
Participants : Maelh (Dev Front), [Nom 2] (Dev Back), [Nom 3] (Design), [Nom 4] (Chef de Projet)
Rôles : La Team "Nuit de l'Apéro" est là pour s'amuser et coder !
        `,
        'README.txt': 'Bienvenue sur notre site interactif ! Veuillez utiliser le terminal pour explorer. Tapez "help" pour plus d\'informations. Le fichier README est normalement lu via la commande "cat README.txt".',
    };
    
    const manualContent = `
============================================================
            MANUEL - Nuit de l'Info 2025
          Guide Complet de Navigation du Site
============================================================

📚 COMMANDES DISPONIBLES:
------------------------------------------------------------
help (ou man) → Affiche ce manuel.
ls            → Liste les fichiers et dossiers disponibles.
cd [dossier]  → Change de dossier (ex: cd projets ou cd ..).
cat [fichier] → Affiche le contenu d'un fichier (ex: cat README.txt).
whoami        → Affiche votre nom d'utilisateur.
clear         → Nettoie l'historique du terminal.
echo [texte]  → Répète le texte entré.
su root       → Accède au mode Superutilisateur (root).
exit          → Quitte le mode root.

📂 DOSSIERS ACCESSIBLES (via 'cd'):
------------------------------------------------------------
home/      projets/      chat/      equipe/

📝 FICHIERS ACCESSIBLES (via 'cat'):
------------------------------------------------------------
README.txt     equipe.txt
`; 

    // --- Fonctions de Logique ---
    
    useEffect(() => {
        const currentPromptUser = isRoot ? 'root' : LOGIN_NAME; 
        setCommandHistory([`${currentPromptUser}@ubuntu:~/${currentPage}$ `, '']); 
    }, [currentPage, userName, isRoot]); 

    const openFile = (filename) => {
        if (files[filename]) {
            setFileContent(files[filename]);
            setShowFileContent(true);
        } else {
            console.error(`Fichier non trouvé : ${filename}`);
        }
    };
    
    // Fonction Autocomplétion (Inchangée)
    const handleTabCompletion = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const parts = input.trim().split(/\s+/);
            const lastPart = parts[parts.length - 1] || '';
            const allTargets = [...availableCommands, ...Object.keys(pages).map(p => p + '/'), ...Object.keys(files)];

            const matches = allTargets.filter(target => target.startsWith(lastPart));

            if (matches.length === 1) {
                const newCommand = parts.slice(0, -1).join(' ') + (parts.length > 1 ? ' ' : '') + matches[0] + ' ';
                setInput(newCommand.trim());
            } else if (matches.length > 1) {
                setCommandHistory(prev => [...prev, `${(isRoot ? 'root' : LOGIN_NAME)}@ubuntu:~/${currentPage}$ ${input.trim()}`]); 
                setCommandHistory(prev => [...prev, matches.join('   '), '']);
            }
        }
    };

    const executeCommand = async () => {
        if (!input.trim()) return;

        const cmd = input.trim(); 
        setCommandHistory(prev => [...prev, `${(isRoot ? 'root' : LOGIN_NAME)}@ubuntu:~/${currentPage}$ ${cmd}`]); 
        setInput('');
        
        // Utilisation de toLowerCase() pour le reste des commandes standard
        const lowerCaseCmd = cmd.toLowerCase();

        // 1. Gérer la commande exit
        if (lowerCaseCmd === 'exit') {
            if (isRoot) {
                setIsRoot(false);
                setCommandHistory(prev => [...prev, 'Déconnexion de root.', '']);
                return;
            } else {
                setCommandHistory(prev => [...prev, 'bash: exit: La session est déjà fermée. Utilisez ctrl+c pour quitter le Terminal.', '']);
                return;
            }
        }
        
        // 2. Gérer la commande su root (ACCÈS DIRECT SANS MOT DE PASSE)
        if (lowerCaseCmd.startsWith('su root')) {
            setIsRoot(true);
            setCommandHistory(prev => [...prev, 'Accès root accordé.', '']);
            return;
        }
        
        // 3. Gérer man/help (OUVRE LA MODALE DU MANUEL)
        if (lowerCaseCmd === 'help' || lowerCaseCmd === 'man') {
            setShowManual(true); // <--- Redirection Modale (CORRIGÉ)
            setCommandHistory(prev => [...prev, 'Ouverture du Manuel...', '']);
            return;
        }
        
        // 4. Commande secrète
        if (lowerCaseCmd === SECRET_COMMAND) {
            setCommandHistory(prev => [
                ...prev, 
                'Message: Welcome, Administrator.', 
                ''
            ]);
            return;
        }
        
        // 5. clear
        if (lowerCaseCmd === 'clear') {
            const currentPromptUser = isRoot ? 'root' : LOGIN_NAME; 
            setCommandHistory([`${currentPromptUser}@ubuntu:~/${currentPage}$ `, '']); 
            return;
        }

        // 6. ls
        if (lowerCaseCmd === 'ls') {
            let list = Object.keys(pages).map(p => p + '/').join('\n') + 
                         '\n' + 
                         Object.keys(files).join('\n');
                         
            setCommandHistory(prev => [...prev, list, '']);
            return;
        }
        
        // 7. cat
        if (lowerCaseCmd.startsWith('cat ')) {
            const filename = lowerCaseCmd.substring(4).trim();
            
            if (files[filename]) {
                setCommandHistory(prev => [...prev, files[filename], '']);
                if (filename === 'equipe.txt' || filename === 'README.txt') {
                    openFile(filename);
                }
            } else {
                setCommandHistory(prev => [...prev, `cat: ${filename}: Aucun fichier ou dossier`, '']);
            }
            return;
        }
        
        // 8. cd
        if (lowerCaseCmd.startsWith('cd ')) {
            const target = lowerCaseCmd.substring(3).trim();
            
            if (target === '..') {
                setCurrentPage('home');
                setCommandHistory(prev => [...prev, 'Retour à home', '', '']);
                return;
            }
            if (pages[target]) {
                setCurrentPage(target);
                if (target === 'chat') {
                    setShowTerminal(false);
                }
                setCommandHistory(prev => [...prev, `Changement vers ${pages[target].title}`, '', '']);
                return;
            }
            setCommandHistory(prev => [...prev, `bash: cd: ${target}: Aucun fichier ou dossier`, '']);
            return;
        }

        // 9. whoami
        if (lowerCaseCmd === 'whoami') {
            const currentRole = isRoot ? 'Superutilisateur (root)' : `Identifiant système (Terminal): ${LOGIN_NAME}`; 
             setCommandHistory(prev => [...prev, `Nom d'affichage: ${userName}`, currentRole, `Équipe: Nuit de l'Apéro`, '']);
             return;
        }
        
        // 10. echo
        if (lowerCaseCmd.startsWith('echo ')) {
            setCommandHistory(prev => [...prev, lowerCaseCmd.substring(5).trim(), '']);
            return;
        }
        
        // Gestion des commandes inconnues
        try {
             setCommandHistory(prev => [...prev, `bash: ${cmd}: command not found`, '']);
        } catch (err) {
             setCommandHistory(prev => [...prev, `Erreur: ${err.message}`, '']);
        }
    };
    
    const openSettings = () => {
        setSettingsInput(userName);
        setShowSettings(true);
    };

    const saveSettings = () => {
        setUserName(settingsInput.trim() || 'user');
    }
    
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [commandHistory]);


    // Rendu de la Barre de Titre GNOME (DOIT RESTER ICI ou être importé/exporté correctement)
    const GnomeTitleBar = ({ title, onClose }) => (
        <div className="flex-shrink-0 h-8 bg-gray-800 flex items-center justify-between px-2 border-b border-gray-700">
            <div className="flex space-x-2">
                <button onClick={onClose} className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition group relative">
                    <X size={8} className="absolute inset-0 m-auto text-red-900 opacity-0 group-hover:opacity-100 transition" />
                </button>
                <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-50 cursor-not-allowed"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full opacity-50 cursor-not-allowed"></div>
            </div>
            <div className="flex items-center flex-1 justify-center text-gray-400 text-xs font-sans select-none">
                {title}
            </div>
            <div className="w-[45px]"></div>
        </div>
    );

    // --- Rendu des Modales Flottantes/Plein Écran ---
    
    // Rendu du Chat (Maintenant avec le composant importé)
    if (currentPage === 'chat' && !showTerminal) {
        return <ChatScreen userName={userName} setCurrentPage={setCurrentPage} />;
    }

    // Rendu de la modale d'affichage de fichier (cat)
    if (showFileContent) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-950/70 backdrop-blur-sm fixed top-0 left-0 z-50"> 
                <div className="w-[80vw] h-[80vh] flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
                    <GnomeTitleBar 
                        title={`Affichage de : ${fileContent === files['equipe.txt'] ? 'equipe.txt' : 'README.txt'}`}
                        onClose={() => setShowFileContent(false)}
                    />
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-900 text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        <pre className="text-white">
                             {fileContent}
                        </pre>
                        <div ref={terminalEndRef} />
                    </div>
                </div>
            </div>
        );
    }
    
    // Rendu de la modale du Manuel (man/help) - Redirection Demandée
    if (showManual) {
        // Cette modale s'affiche par-dessus le reste
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-950/70 backdrop-blur-sm fixed top-0 left-0 z-50"> 
                 <div className="w-[80vw] h-[80vh] flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
                    <GnomeTitleBar 
                        title="Manuel de Bord (Man Page)"
                        onClose={() => setShowManual(false)}
                    />
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-900 text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        <pre className="text-yellow-400 mb-4 font-bold text-lg">
                            {manualContent.split('\n').map((line, index) => {
                                let coloredLine = line;
                                if (line.includes('COMMANDES DISPONIBLES') || line.includes('DOSSIERS ACCESSIBLES') || line.includes('FICHIERS ACCESSIBLES')) {
                                    coloredLine = <span className="text-orange-400 font-bold">{line}</span>;
                                } 
                                else if (line.trim().startsWith('help') || line.trim().startsWith('ls') || line.trim().startsWith('cd') || line.trim().startsWith('cat') || line.trim().startsWith('whoami') || line.trim().startsWith('clear') || line.trim().startsWith('echo') || line.trim().startsWith('man') || line.trim().startsWith('su') || line.trim().startsWith('exit')) {
                                    coloredLine = (
                                        <span>
                                            <span className="text-green-400">{line.split('→')[0]}</span>
                                            {line.includes('→') ? ` → ${line.split('→')[1]}` : ''}
                                        </span>
                                    );
                                } 
                                else if (line.includes('MANUEL - Nuit de l\'Info 2025')) {
                                    coloredLine = <span className="text-yellow-400 font-extrabold">{line}</span>;
                                }
                                return <div key={index}>{coloredLine}</div>;
                            })}
                        </pre>
                    </div>
                 </div>
            </div>
        );
    }

    // Rendu de la fenêtre du Terminal
    if (showTerminal) {
        // Définition des classes en fonction des états d'accessibilité (Inchangée)
        const terminalBgClass = highContrast ? 'bg-black' : 'bg-gray-950';
        const terminalTextClass = highContrast ? 'text-lime-400' : 'text-green-400';
        const terminalFontSizeClass = fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-lg' : 'text-sm';
        
        return (
            // z-index bas (z-40) pour permettre aux autres modales (man/cat) de s'afficher dessus (z-50)
            <div className="w-screen h-screen flex items-center justify-center bg-gray-950/70 backdrop-blur-sm fixed top-0 left-0 z-40"> 
                <div className="w-[80vw] h-[80vh] flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
                    
                    <GnomeTitleBar 
                        title={`${(isRoot ? 'root' : LOGIN_NAME)}@ubuntu: ~/${currentPage} - Terminal`} 
                        onClose={() => setShowTerminal(false)}
                    />

                    <div className={`flex-1 flex flex-col overflow-hidden ${terminalBgClass}`}>
                        <div className={`flex-1 overflow-y-auto p-4 font-mono leading-relaxed ${terminalBgClass} ${terminalTextClass} ${terminalFontSizeClass}`}>
                            {commandHistory.map((line, idx) => (
                                <div key={idx} className="whitespace-pre-wrap break-all">{line}</div>
                            ))}
                            <div ref={terminalEndRef} />
                        </div>

                        <div className="bg-gray-900 p-3 border-t border-gray-800 flex items-center gap-2 font-mono">
                            <span className={terminalTextClass}>{(isRoot ? 'root' : LOGIN_NAME)}@ubuntu:~/{currentPage}$</span> 
                            <input 
                                type="text" 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                onKeyPress={(e) => e.key === 'Enter' ? executeCommand() : handleTabCompletion(e)} 
                                onKeyDown={handleTabCompletion} 
                                className={`flex-1 bg-transparent outline-none font-mono ${terminalTextClass} ${terminalFontSizeClass}`} 
                                autoFocus 
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Rendu du Bureau Ubuntu et du Dock ---
    const handleDockClick = (action) => {
        action();
    };
    
    // Définition de la classe pour réduire les animations ou non
    const transitionClass = reducedMotion ? '' : 'transition';

    return (
        // Application du style de curseur agrandi (largeCursor)
        <div className={`w-screen h-screen overflow-hidden flex flex-col ${largeCursor ? 'cursor-crosshair' : ''}`} style={{ backgroundImage: 'url(/fond_ecran.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
            {/* Barre Supérieure (Top Bar) - Inchangée */}
            <div className="bg-gray-950 bg-opacity-95 h-10 flex items-center px-4 shadow-lg border-b border-gray-800">
                <div className="text-white text-sm font-semibold">Activities</div>
                <div className="flex-1 flex justify-center">
                    <div className="text-white text-xs font-mono">{new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="text-white text-xs font-mono">{userName}</div>
                    <div className="text-white text-xs font-mono">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Dock / Lanceur d'Applications (Gauche) - Inchangé */}
                <div className="w-20 bg-gray-950 bg-opacity-95 flex flex-col items-center py-4 gap-4 border-r border-gray-800 shadow-lg">
                    
                    {/* Terminal */}
                    <div onClick={() => handleDockClick(() => setShowTerminal(true))} className={`w-12 h-12 bg-black rounded-lg flex items-center justify-center hover:scale-110 ${transitionClass} cursor-pointer shadow-md p-1 border overflow-hidden border-purple-600`}>
                        <img src="/logo.png" alt="Terminal" className="w-full h-full object-cover rounded" />
                    </div>

                    {/* Manuel (HELP) */}
                    <div onClick={() => handleDockClick(() => {
                        setShowTerminal(true); // Ouvre le terminal
                        setShowManual(true); // Ouvre le manuel par-dessus
                    })} className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 ${transitionClass} cursor-pointer shadow-md p-1 border border-yellow-500`}>
                        <BookOpen size={24} className="text-yellow-400" />
                    </div>

                    {/* Chat */}
                    <div onClick={() => handleDockClick(() => setCurrentPage('chat'))} className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 ${transitionClass} cursor-pointer shadow-md p-1 border border-blue-400`}>
                        <MessageCircle size={24} className="text-blue-400" />
                    </div>

                    <div className="flex-1"></div>
                    
                    {/* Icône de Paramètres (Utilisateur) - TOUJOURS ACCESSIBLE */}
                    <div onClick={openSettings} className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 ${transitionClass} cursor-pointer shadow-md p-1 mb-4`}>
                         <User size={24} className="text-gray-400" />
                    </div>
                </div>

                {/* Contenu Principal du Bureau (VIDE) */}
                <div className="flex-1 p-12 overflow-hidden relative">
                    {/* Le bureau reste vide, la navigation se fait par le Terminal ou les modales. */}
                </div>
            </div>
            
            {/* 3. Intégration du composant de paramètres séparé ici, à la fin du rendu */}
            <AccessibilitySettings
                userName={userName}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                fontSize={fontSize}
                setFontSize={setFontSize}
                highContrast={highContrast}
                setHighContrast={setHighContrast}
                systemSounds={systemSounds}
                setSystemSounds={setSystemSounds}
                reducedMotion={reducedMotion}
                setReducedMotion={setReducedMotion}
                largeCursor={largeCursor}
                setLargeCursor={setLargeCursor}
            />
        </div>
    );
};

export default UbuntuDesktop;