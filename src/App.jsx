import React, { useState, useRef, useEffect } from 'react';
// IMPORTS DES ICÔNES
import { X, Code, BookOpen, MessageCircle, Gamepad, Dumbbell } from 'lucide-react'; 
// IMPORTS DES COMPOSANTS MODAUX
import ChatScreen from './ChatScreen'; 
import AccessibilitySettings from './AccessibilitySettings'; 
import Manual from './Manual'; 
import Terminal from './Terminal'; 
import SnakeGameScreen from './SnakeGameScreen'; 
import PixelGameScreen from './PixelgameScreen'; 
import IndexScreen from './IndexScreen'; // Import de IndexScreen

// CONSTANTES FIXES
const LOGIN_NAME = 'nuit-de-l-apero'; 
const ROOT_NAME = 'root'; // Nouveau nom d'utilisateur root
const SNAKE_GAME_PATH = '/snake_game.html'; 
const PIXEL_GAME_PATH = '/pixel_game.html'; 
const INDEX_HTML_PATH = '/index_game.html'; // Chemin Index

const UbuntuDesktop = () => {
    // --- États du Composant ---
    const [currentPage, setCurrentPage] = useState('home');
    const [commandHistory, setCommandHistory] = useState([
        `Welcome to Ubuntu 22.04 LTS`,
        '',
    ]);
    const [input, setInput] = useState('');

    const [showTerminal, setShowTerminal] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showChat, setShowChat] = useState(false); 
    const [showSnake, setShowSnake] = useState(false); 
    const [showPixelGame, setShowPixelGame] = useState(false); 
    const [showIndex, setShowIndex] = useState(false); // État pour IndexScreen
    const [userName, setUserName] = useState("La Nuit de l'Apéro"); 
    const [settingsInput, setSettingsInput] = useState("La Nuit de l'Apéro"); 
    
    // ÉTAT POUR SIMULER L'UTILISATEUR ACTUEL
    const [currentSystemUser, setCurrentSystemUser] = useState(LOGIN_NAME); 
    
    // **********************************************
    // ÉTATS DE POSITION ET DE MOUVEMENT POUR showFileContent (Fichiers texte uniquement)
    // **********************************************
    const [isFileContentDragging, setIsFileContentDragging] = useState(false);
    const [fileContentPosition, setFileContentPosition] = useState({ x: 0, y: 0 }); 
    const dragOffset = useRef({ x: 0, y: 0 });
    
    // ÉTATS D'ACCESSIBILITÉ
    const [fontSize, setFontSize] = useState('normal'); 
    const [highContrast, setHighContrast] = useState(false);
    const [systemSounds, setSystemSounds] = useState(true); 
    const [reducedMotion, setReducedMotion] = useState(false); 
    const [largeCursor, setLargeCursor] = useState(false);
    
    // showFileContent et fileContent ne servent plus que pour les fichiers texte
    const [showFileContent, setShowFileContent] = useState(false);
    const [fileContent, setFileContent] = useState('');

    // Définitions des pages
    const pages = {
        home: { name: 'home', title: 'Accueil' },
        chat: { name: 'chat', title: 'Chat' },
        projets: { name: 'projets', title: 'Projets' },
        equipe: { name: 'equipe', title: 'Équipe' }
    };

    // Liste complète des commandes (Ajout de 'su root', 'exit')
    const availableCommands = ['help', 'ls', 'cd', 'cat', 'whoami', 'clear', 'echo', 'man', 'chat', 'snake', 'pixel', 'index', 'close', 'su root', 'exit'];
    
    // Définitions des fichiers 
    const files = {
        'snake.html': `<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Snake Game</title>
</head>
<body>
    <div>Contenu du fichier HTML du jeu Snake. Non affichable directement dans le terminal.</div>
</body>
</html>`,
        'pixel_game.html': `<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Pixel Game</title>
</head>
<body>
    <div>Contenu du fichier HTML du jeu Pixel. Non affichable directement dans le terminal.</div>
</body>
</html>`,
        'index.html': `<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Index</title>
</head>
<body>
    <div>Contenu du fichier HTML de l'Index. Non affichable directement dans le terminal.</div>
</body>
</html>`
    };
    
    // Contenu du Manuel 
    const manualContent = `MANUEL D'UTILISATION (man)
----------------------------
Les commandes disponibles sont :
- help / man : Affiche ce manuel.
- ls : Liste les fichiers et dossiers dans le répertoire actuel.
- cd [dossier] : Change de répertoire. (Ex: cd chat)
- cat [fichier.txt] : Affiche le contenu d'un fichier.
- whoami : Affiche le nom d'utilisateur actuel.
- clear : Nettoie le terminal.
- chat : Ouvre la fenêtre de discussion (standard user only).
- pixel : Lance le jeu Pixel (standard user only).
- index : Lance l'application Index (accessible à tous).
- su root : **Passe en mode super-utilisateur (root) SANS MOT DE PASSE.**
- exit : **Quitte le mode root** pour revenir à l'utilisateur standard.
- close : Ferme la fenêtre flottante actuellement ouverte (Jeu, Fichier Texte).
----------------------------
NOTE : Le jeu **snake** est un logiciel critique et ne peut être lancé qu'en mode root.
Les dossiers disponibles sont : home, chat, projets, equipe.
`;

    // --- Fonctions de Logique de Draggable Window (Fichiers Texte) ---
    const handleFileContentMouseDown = (e) => {
        const isTitleBar = e.currentTarget.className.includes('draggable-handle');
        if (!isTitleBar) return;
        
        e.preventDefault();
        setIsFileContentDragging(true);
        dragOffset.current = {
            x: e.clientX - fileContentPosition.x,
            y: e.clientY - fileContentPosition.y,
        };
    };

    const handleFileContentMouseMove = (e) => {
        if (!isFileContentDragging) return;
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        setFileContentPosition({ x: newX, y: newY });
    };

    const handleFileContentMouseUp = () => {
        setIsFileContentDragging(false);
    };

    useEffect(() => {
        if (showFileContent) {
            document.addEventListener('mousemove', handleFileContentMouseMove);
            document.addEventListener('mouseup', handleFileContentMouseUp);
        } else {
            setFileContentPosition({ x: 0, y: 0 });
        }

        return () => {
            document.removeEventListener('mousemove', handleFileContentMouseMove);
            document.removeEventListener('mouseup', handleFileContentMouseUp);
        };
    }, [showFileContent, isFileContentDragging]);
    
    // --- Fonctions de Logique du Terminal ---

    useEffect(() => {
        // Met à jour l'invite de commande avec l'utilisateur actuel
        setCommandHistory([`${currentSystemUser}@ubuntu:~/${currentPage}$ `, '']);
    }, [currentPage, userName, currentSystemUser]); 

    const openFile = (filename) => {
        // Position initiale au centre
        setFileContentPosition({ x: 0, y: 0 }); 
        if (files[filename]) {
            setFileContent(files[filename]);
            setShowFileContent(true);
        } else {
            console.error(`Fichier non trouvé : ${filename}`);
        }
    };
    
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
                setCommandHistory(prev => [...prev, `${currentSystemUser}@ubuntu:~/${currentPage}$ ${input.trim()}`]);
                setCommandHistory(prev => [...prev, matches.join('   '), '']);
            }
        }
    };

    const handleDockClick = (action) => {
        if (systemSounds) {
            // Son de clic ici
        }
        action();
    };
    
    // Fonction pour lancer IndexScreen depuis le Dock (Autorisé pour tous)
    const openIndexScreenFromDock = () => {
        setShowIndex(true); 
    };

    const closeFloatingWindow = (showHistory = true) => {
        setShowFileContent(false);
        setFileContent(''); 
        
        if (showHistory) {
            setCommandHistory(prev => [...prev, `Fenêtre fichier texte fermée.`, '']);
        }
    };
    
    // Fonction pour simuler 'close' dans l'historique (utilisé par la croix des modales)
    const simulateTerminalCloseHistory = () => {
        setCommandHistory(prev => [...prev, `${currentSystemUser}@ubuntu:~/${currentPage}$ close`]);
    };


    const executeCommand = async () => {
        if (!input.trim()) return;

        const cmd = input.trim().toLowerCase();
        setCommandHistory(prev => [...prev, `${currentSystemUser}@ubuntu:~/${currentPage}$ ${cmd}`]);
        setInput('');
        
        // 🔑 COMMANDE 'su root' (Pas de mot de passe)
        if (cmd === 'su root') {
            if (currentSystemUser === ROOT_NAME) {
                setCommandHistory(prev => [...prev, `su: La commande 'su root' ne peut être exécutée par l'utilisateur root.`, '']);
            } else {
                setCurrentSystemUser(ROOT_NAME);
                setCommandHistory(prev => [...prev, `Passage en mode super-utilisateur (root). Attention aux permissions!`, '']);
            }
            return;
        }

        // 🚪 COMMANDE 'exit'
        if (cmd === 'exit') {
            if (currentSystemUser === ROOT_NAME) {
                setCurrentSystemUser(LOGIN_NAME);
                setCommandHistory(prev => [...prev, `Déconnexion du mode root. Retour à ${LOGIN_NAME}.`, '']);
            } else {
                setCommandHistory(prev => [...prev, `exit: Vous n'êtes pas en mode root.`, '']);
            }
            return;
        }
        
        // ❌ COMMANDE 'close'
        if (cmd === 'close') {
            if (showSnake) {
                setShowSnake(false);
                setCommandHistory(prev => [...prev, `Fenêtre Snake fermée.`, '']);
                return;
            }
            
            // Fermeture du Pixel Game
            if (showPixelGame) {
                setShowPixelGame(false);
                setCommandHistory(prev => [...prev, `Fenêtre Pixel Game fermée.`, '']);
                return;
            }
            
            // Fermeture de IndexScreen
            if (showIndex) {
                setShowIndex(false);
                setCommandHistory(prev => [...prev, `Fenêtre Index fermée.`, '']);
                return;
            }
            
            if (showFileContent) {
                closeFloatingWindow(true); 
            } else {
                setCommandHistory(prev => [...prev, `Aucune fenêtre flottante active à fermer.`, '']);
            }
            return;
        }
        
        // 🏋️‍♀️ COMMANDE 'index' (IndexScreen) - ACCESSIBLE À TOUS
        if (cmd === 'index') {
            setCommandHistory(prev => [...prev, `Chargement de l'application Index...`, '']);
            setShowIndex(true); 
            return;
        }

        // 🐍 COMMANDE 'snake' (UNiquement pour ROOT)
        if (cmd === 'snake') {
            if (currentSystemUser !== ROOT_NAME) {
                 setCommandHistory(prev => [...prev, `snake: Permission refusée.`, '']);
                 return;
            }
            setCommandHistory(prev => [...prev, `Chargement du jeu Snake en mode ROOT.`, '']);
            setShowSnake(true); 
            return;
        }

        // 👾 COMMANDE 'pixel' (Pixel Game)
        if (cmd === 'pixel') {
            if (currentSystemUser === ROOT_NAME) {
                 setCommandHistory(prev => [...prev, `pixel: Permission refusée. Les applications non critiques ne peuvent pas être lancées par root.`, '']);
                 return;
            }
            setCommandHistory(prev => [...prev, `Chargement du jeu Pixel...`, '']);
            setShowPixelGame(true); // Ouvre la modale du jeu Pixel
            return;
        }
        
        // cat
        if (cmd.startsWith('cat ')) {
            const filename = cmd.substring(4).trim();
            
            if (files[filename]) {
                // On affiche le contenu dans le terminal pour simuler `cat`
                setCommandHistory(prev => [...prev, files[filename], '']);
                
                // On ouvre la fenêtre modale draggable pour simuler un afficheur de fichier texte
                // EXCLUSION des jeux et de index.html
                if (filename !== 'snake.html' && filename !== 'pixel_game.html' && filename !== 'decathlon.html') {
                    openFile(filename); 
                } 
            } else {
                setCommandHistory(prev => [...prev, `cat: ${filename}: Aucun fichier ou dossier`, '']);
            }
            return;
        }
        
        // help / man
        if (cmd === 'help' || cmd === 'man') {
            setShowManual(true);
            setCommandHistory(prev => [...prev, 'Ouverture du Manuel...', '']);
            return;
        }

        // chat
        if (cmd === 'chat') {
            if (currentSystemUser === ROOT_NAME) {
                 setCommandHistory(prev => [...prev, `chat: Permission refusée. Les applications non critiques ne peuvent pas être lancées par root.`, '']);
                 return;
            }
            setShowChat(true); 
            setCommandHistory(prev => [...prev, 'Ouverture du ChatBot...', '']);
            setInput('');
            return;
        }

        // clear
        if (cmd === 'clear') {
            setCommandHistory([`${currentSystemUser}@ubuntu:~/${currentPage}$ `, '']);
            return;
        }

        // ls
        if (cmd === 'ls') { 
            const dirs = Object.keys(pages).map(p => p + '/').join('   ');
            const fileNames = Object.keys(files).join('   ');
            setCommandHistory(prev => [...prev, dirs, fileNames, '']);
            return;
        }

        // cd
        if (cmd.startsWith('cd ')) { 
            const targetPage = cmd.substring(3).trim().replace('/', '');
            if (pages[targetPage]) {
                setCurrentPage(targetPage);
            } else if (targetPage === '..' || targetPage === '~') {
                setCurrentPage('home');
            } else {
                setCommandHistory(prev => [...prev, `bash: cd: ${targetPage}: No such file or directory`, '']);
            }
            return;
        }

        // whoami
        if (cmd === 'whoami') { 
             setCommandHistory(prev => [...prev, currentSystemUser, '']);
             return;
        }

        // echo
        if (cmd.startsWith('echo ')) { 
             const message = cmd.substring(5).trim();
             setCommandHistory(prev => [...prev, message, '']);
             return;
        }

        // Commande inconnue
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


    // Rendu de la Barre de Titre GNOME (Pour les fichiers texte uniquement)
    const GnomeTitleBar = ({ title, onClose, onMouseDown, simulateTerminalClose }) => (
        <div 
            className="flex-shrink-0 h-8 bg-gray-800 flex items-center justify-between px-2 border-b border-gray-700 cursor-grab active:cursor-grabbing draggable-handle"
            onMouseDown={onMouseDown} 
        >
            <div className="flex space-x-2">
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        simulateTerminalClose(); 
                        onClose(); 
                    }} 
                    className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition group relative flex items-center justify-center"
                >
                    <X size={8} className="text-red-900 opacity-0 group-hover:opacity-100 transition pointer-events-none" /> 
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
    
    // Ces vérifications ne sont plus nécessaires dans le return car nous utilisons les états booléens showX
    // const isSnakeGame = fileContent === SNAKE_GAME_PATH; 
    // const isPixelGameRendered = fileContent === PIXEL_GAME_PATH; 
    const transitionClass = reducedMotion ? '' : 'transition duration-300';

    return (
        <div 
            className={`w-screen h-screen overflow-hidden flex flex-col ${largeCursor ? 'cursor-crosshair' : ''}`} 
            style={{ backgroundImage: 'url(/fond_ecran.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}
        >
            {/* Barre Supérieure (Top Bar) */}
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
                {/* Dock / Lanceur d'Applications (Gauche) */}
                <div className="w-20 bg-gray-950 bg-opacity-95 flex flex-col items-center py-4 gap-4 border-r border-gray-800 shadow-lg">
                    
                    {/* Terminal (ICÔNE Code) */}
                    <div onClick={() => handleDockClick(() => setShowTerminal(true))} className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 ${transitionClass} cursor-pointer shadow-md p-1 border border-purple-600`}>
                        <Code size={24} className="text-purple-400"/> 
                    </div>

                    {/* Manuel (HELP) */}
                    <div onClick={() => handleDockClick(() => setShowManual(true))} className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 ${transitionClass} cursor-pointer shadow-md p-1 border border-yellow-500`}>
                        <BookOpen size={24} className="text-yellow-400" />
                    </div>

                    {/* Chat */}
                    <div 
                        onClick={() => handleDockClick(() => setShowChat(true))} 
                        className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 ${transitionClass} cursor-pointer shadow-md p-1 border border-blue-400`}
                    >
                        <MessageCircle size={24} className="text-blue-400" />
                    </div>
                    
                    {/* 🏋️‍♀️ IndexScreen (ICÔNE Dumbbell) */}
                    <div onClick={() => handleDockClick(openIndexScreenFromDock)} className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 ${transitionClass} cursor-pointer shadow-md p-1 border border-orange-500`}>
                        <Dumbbell size={24} className="text-orange-400"/> 
                    </div>

                    {/* 👾 Pixel Game (ICÔNE Gamepad) */}
                    <div onClick={() => handleDockClick(() => setShowPixelGame(true))} className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 ${transitionClass} cursor-pointer shadow-md p-1 border border-pink-500`}>
                        <Gamepad size={24} className="text-pink-400"/> 
                    </div>

                    <div className="flex-1"></div>
                    
                    {/* Icône de Paramètres (Accessibilité) */}
                    <div onClick={openSettings} className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 ${transitionClass} cursor-pointer shadow-md p-1 mb-4 border border-gray-400`}>
                        <img src="/logo.png" alt="Paramètres Accessibilité" className="w-full h-full object-cover rounded" />
                    </div>
                </div>

                {/* Contenu Principal du Bureau (Dynamique) */}
                <div className="flex-1 p-12 overflow-hidden relative">
                    
                    {/* 🏠 PAGE HOME (Accueil) - TOTALEMENT VIERGE */}
                    {currentPage === 'home' && (
                        <></> 
                    )}

                    {/* 💬 PAGE CHAT */}
                    {currentPage === 'chat' && (
                        <div className="text-white text-xl font-bold bg-blue-900/70 p-6 rounded-lg shadow-2xl backdrop-blur-sm">
                            <h2 className="text-2xl mb-4 border-b border-blue-600 pb-2">Dossier Chat</h2>
                            <p className="text-sm font-light text-gray-200">
                                Ce dossier est vide, mais le **ChatBot** est accessible via l'icône `<MessageCircle />` ou la commande **`chat`**.
                            </p>
                        </div>
                    )}
                    
                    {/* 🗂️ PAGE PROJETS */}
                    {currentPage === 'projets' && (
                        <div className="text-white text-xl font-bold bg-yellow-900/70 p-6 rounded-lg shadow-2xl backdrop-blur-sm">
                            <h2 className="2xl mb-4 border-b border-yellow-600 pb-2">Dossier Projets</h2>
                            <p className="text-sm font-light text-gray-200">
                                Contient les projets. Le jeu **Snake**, **Pixel Game** et l'application **Index** sont cachés ici (accessibles via **`snake`**, **`pixel`** ou **`index`**).
                            </p>
                        </div>
                    )}
                    
                    {/* 👥 PAGE ÉQUIPE */}
                    {currentPage === 'equipe' && (
                        <div className="text-white text-xl font-bold bg-red-900/70 p-6 rounded-lg shadow-2xl backdrop-blur-sm">
                            <h2 className="text-2xl mb-4 border-b border-red-600 pb-2">Dossier Équipe</h2>
                            <p className="text-sm font-light text-gray-200">
                                **Ce dossier est maintenant vide.** Tous les fichiers texte ont été supprimés du système.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Composants Modaux */}
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
            
            <Terminal 
                showTerminal={showTerminal}
                setShowTerminal={setShowTerminal}
                currentPage={currentPage}
                commandHistory={commandHistory}
                input={input}
                setInput={setInput}
                executeCommand={executeCommand}
                handleTabCompletion={handleTabCompletion}
                fontSize={fontSize}
                highContrast={highContrast}
                LOGIN_NAME={currentSystemUser} 
                inputPlaceholder="place order"
            />

            <Manual
                showManual={showManual}
                setShowManual={setShowManual}
                manualContent={manualContent}
            />
            
            <ChatScreen
                userName={userName}
                showChat={showChat} 
                setShowChat={setShowChat} 
                setCurrentPage={setCurrentPage} 
            />

            {/* 🐍 Rendu du jeu Snake (Composant Dédié) */}
            <SnakeGameScreen
                showSnake={showSnake}
                setShowSnake={setShowSnake}
                simulateTerminalCloseHistory={simulateTerminalCloseHistory}
            />
            
            {/* 👾 Rendu du jeu Pixel (Composant Dédié) */}
            <PixelGameScreen
                showPixelGame={showPixelGame}
                setShowPixelGame={setShowPixelGame}
                simulateTerminalCloseHistory={simulateTerminalCloseHistory}
            />

            {/* 🏋️‍♀️ Rendu de l'écran Index (Composant Dédié) */}
            <IndexScreen
                showIndex={showIndex}
                setShowIndex={setShowIndex}
                simulateTerminalCloseHistory={simulateTerminalCloseHistory}
            />
            
            {/* Rendu de la Fenêtre Flottante Draggable (Fichiers Texte SEULEMENT) */}
            {/* Important : N'affiche cette fenêtre QUE si AUCUNE modale spécifique n'est ouverte (showSnake, showPixelGame, showIndex) */}
            {showFileContent && !showSnake && !showPixelGame && !showIndex && (
                <div 
                    className={`fixed flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700 pointer-events-auto z-50 
                                 w-[80vw] h-[80vh] max-w-[800px] max-h-[600px]`}
                    style={{
                        transform: `translate(calc(-50% + ${fileContentPosition.x}px), calc(-50% + ${fileContentPosition.y}px))`,
                        top: '50%',
                        left: '50%',
                        cursor: isFileContentDragging ? 'grabbing' : 'default',
                    }}
                >
                    <GnomeTitleBar 
                        title={`Affichage de : ${
                            Object.keys(files).find(key => files[key] === fileContent) || 'Fichier Texte'
                        }`}
                        onClose={() => closeFloatingWindow(false)} 
                        simulateTerminalClose={simulateTerminalCloseHistory} 
                        onMouseDown={handleFileContentMouseDown}
                    />
                    
                    {/* LOGIQUE D'AFFICHAGE DU CONTENU TEXTE */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-900 text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        <pre className="text-white">
                            {fileContent}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UbuntuDesktop;