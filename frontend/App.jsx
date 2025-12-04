import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Terminal, BookOpen, MessageCircle, User } from 'lucide-react'; 

// CONSTANTE FIXE : Nom de l'équipe pour le prompt du Terminal
const LOGIN_NAME = 'nuit-de-l-apero'; 
// COMMANDE CACHÉE (maintenue pour la démo, mais n'a plus d'effet)
const SECRET_COMMAND = 'login hack';

const UbuntuDesktop = () => {
    // --- États du Composant ---
    const [currentPage, setCurrentPage] = useState('home');
    const [commandHistory, setCommandHistory] = useState([
        `Welcome to Ubuntu 22.04 LTS`,
        '',
    ]);
    const [input, setInput] = useState('');
    
    // Suggestions initiales allégées
    const [suggestions, setSuggestions] = useState(['help', 'ls', 'cd about']); 
    
    // État de sécurité - DÉFINI ET FIXÉ À TRUE (Accès débloqué)
    const [isAccessGranted, setIsAccessGranted] = useState(true); 

    const [showTerminal, setShowTerminal] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [userName, setUserName] = useState('maelh'); 
    const [settingsInput, setSettingsInput] = useState('maelh'); 
    
    const [chatMessages, setChatMessages] = useState([
        { type: 'system', text: 'Bienvenue au chat!', author: 'Nuit de l\'Apéro', timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [chatInput, setChatInput] = useState('');
    
    const terminalEndRef = useRef(null);
    const chatEndRef = useRef(null);
    
    const [showFileContent, setShowFileContent] = useState(false);
    const [fileContent, setFileContent] = useState('');

    const API_URL = 'http://localhost:5000/api';

    // Définitions des pages (inchangées)
    const pages = {
        home: { name: 'home', title: 'Accueil' },
        about: { name: 'about', title: 'À propos' },
        contact: { name: 'contact', title: 'Contact' },
        chat: { name: 'chat', title: 'Chat' },
        projets: { name: 'projets', title: 'Projets' },
        equipe: { name: 'equipe', title: 'Équipe' }
    };

    // Définitions des fichiers (avec equipe.txt toujours présent)
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

📚 PAGES DISPONIBLES:
[🏠 home] (Accueil)
   Commande: cd home
   Commandes: help, ls, cat README.txt, cd about, cd projets, cd equipe, cd contact, cd chat
...
`;

    // --- Fonctions de Logique ---
    
    useEffect(() => {
        setCommandHistory([`${LOGIN_NAME}@ubuntu:~/${currentPage}$ `, '']);
        fetchPageInfo(currentPage); 
    }, [currentPage, userName]);

    const fetchPageInfo = async (page) => {
        try {
            const res = await fetch(`${API_URL}/pages/${page}`);
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data.commands || []);
            }
        } catch (err) {
            if (page === 'home') setSuggestions(['help', 'ls', 'cd about', 'cat README.txt']);
            else setSuggestions(['help', 'ls', 'cd ..']);
        }
    };

    const openFile = (filename) => {
        if (files[filename]) {
            setFileContent(files[filename]);
            setShowFileContent(true);
        } else {
            console.error(`Fichier non trouvé : ${filename}`);
        }
    };

    const executeCommand = async () => {
        if (!input.trim()) return;

        const cmd = input.trim().toLowerCase();
        setCommandHistory(prev => [...prev, `${LOGIN_NAME}@ubuntu:~/${currentPage}$ ${cmd}`]);
        setInput('');
        
        if (cmd === SECRET_COMMAND) {
            setCommandHistory(prev => [
                ...prev, 
                'Message: Welcome, Administrator.', 
                ''
            ]);
            return;
        }
        
        if (cmd === 'help' || cmd === 'man') {
            setShowManual(true);
            setCommandHistory(prev => [...prev, 'Ouverture du Manuel...', '']);
            return;
        }
        
        if (cmd === 'clear') {
            setCommandHistory([`${LOGIN_NAME}@ubuntu:~/${currentPage}$ `, '']);
            return;
        }

        if (cmd === 'ls') {
            // NOTE: 'equipe.txt' sera listé ici
            let list = Object.keys(pages).map(p => p + '/').join('\n') + 
                         '\n' + 
                         Object.keys(files).join('\n');
                         
            setCommandHistory(prev => [...prev, list, '']);
            return;
        }
        
        if (cmd.startsWith('cat ')) {
            const filename = cmd.substring(4).trim();
            
            // L'accès au contenu de equipe.txt se fait ici
            if (files[filename]) {
                setCommandHistory(prev => [...prev, files[filename], '']);
                // Ouvre la modale pour une meilleure lecture si c'est equipe.txt
                if (filename === 'equipe.txt') {
                    openFile('equipe.txt');
                }
            } else {
                setCommandHistory(prev => [...prev, `cat: ${filename}: Aucun fichier ou dossier`, '']);
            }
            return;
        }
        
        if (cmd.startsWith('cd ')) {
            const target = cmd.substring(3).trim();
            
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

        if (cmd === 'whoami') {
             setCommandHistory(prev => [...prev, `Nom d'affichage: ${userName}`, `Identifiant système (Terminal): ${LOGIN_NAME}`, `Équipe: Nuit de l'Apéro`, '']);
             return;
        }
        
        if (cmd.startsWith('echo ')) {
            setCommandHistory(prev => [...prev, cmd.substring(5).trim(), '']);
            return;
        }

        try {
             setCommandHistory(prev => [...prev, `bash: ${cmd}: command not found`, '']);
        } catch (err) {
             setCommandHistory(prev => [...prev, `Erreur: ${err.message}`, '']);
        }
    };
    
    // ... (Reste des fonctions inchangées)

    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setChatMessages(prev => [...prev, { 
            type: 'user', 
            text: userMsg,
            author: userName, 
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setChatInput('');

        setTimeout(() => {
            setChatMessages(prev => [...prev, { 
                type: 'assistant', 
                text: `Salut ${userName} ! Je suis l'assistant de Nuit de l'Apéro. Que puis-je faire pour toi ?`,
                author: 'Nuit de l\'Apéro',
                timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 500);
    };

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
    };

    const openSettings = () => {
        setSettingsInput(userName);
        setShowSettings(true);
    };

    const saveSettings = () => {
        setUserName(settingsInput.trim() || 'user');
        setShowSettings(false);
    }
    
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [commandHistory]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Rendu de la Barre de Titre GNOME (Réutilisable)
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
    
    if (showFileContent) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-950/70 backdrop-blur-sm"> 
                <div className="w-[80vw] h-[80vh] flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
                    <GnomeTitleBar 
                        title={`Affichage de : ${fileContent === files['equipe.txt'] ? 'equipe.txt' : 'README.txt'}`}
                        onClose={() => setShowFileContent(false)}
                    />
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-900 text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        <pre className="text-white">
                             {fileContent}
                        </pre>
                    </div>
                </div>
            </div>
        );
    }
    
    if (showSettings) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
                <div className="w-96 bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><User size={20} className="mr-2 text-yellow-400" /> Paramètres Utilisateur</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Nom d'affichage (Chat/Barre du haut)</label>
                        <input
                            type="text"
                            value={settingsInput}
                            onChange={(e) => setSettingsInput(e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                        />
                         <p className="text-xs text-gray-500 mt-1">Le prompt du terminal restera `{LOGIN_NAME}@ubuntu`.</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition">Annuler</button>
                        <button onClick={saveSettings} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Sauvegarder</button>
                    </div>
                </div>
            </div>
        );
    }

    if (showTerminal) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-950/70 backdrop-blur-sm">
                <div className="w-[80vw] h-[80vh] flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
                    
                    <GnomeTitleBar 
                        title={`${LOGIN_NAME}@ubuntu: ~/${currentPage} - Terminal`}
                        onClose={() => setShowTerminal(false)}
                    />

                    <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-950 text-green-400 font-mono text-sm leading-relaxed">
                            {commandHistory.map((line, idx) => (
                                <div key={idx} className="whitespace-pre-wrap break-all">{line}</div>
                            ))}
                            <div ref={terminalEndRef} />
                        </div>

                        {suggestions.length > 0 && (
                            <div className="bg-gray-900 p-3 border-t border-gray-800">
                                <div className="text-xs text-purple-400 mb-2 font-mono">Available commands:</div>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map((cmd, idx) => (
                                        <button key={idx} onClick={() => handleSuggestionClick(cmd)} className="px-2 py-0.5 bg-gray-800 hover:bg-gray-700 border border-purple-600 rounded text-xs text-purple-400 transition cursor-pointer font-mono">
                                            {cmd}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-900 p-3 border-t border-gray-800 flex items-center gap-2 font-mono">
                            <span className="text-green-400">{LOGIN_NAME}@ubuntu:~/{currentPage}$</span>
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && executeCommand()} className="flex-1 bg-transparent outline-none text-green-400 text-sm font-mono" autoFocus />
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    if (showManual) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-950/70 backdrop-blur-sm">
                 <div className="w-[80vw] h-[80vh] flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
                    <GnomeTitleBar 
                        title="Manuel de Bord (Man Page)"
                        onClose={() => setShowManual(false)}
                    />
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-900 text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        <pre className="text-yellow-400 mb-4 font-bold text-lg">
                            {manualContent.split('\n').map((line, index) => {
                                let coloredLine = line;
                                if (line.includes('PAGES DISPONIBLES') || line.includes('COMMANDES GÉNÉRALES')) {
                                    coloredLine = <span className="text-orange-400 font-bold">{line}</span>;
                                } 
                                else if (line.trim().startsWith('ls') || line.trim().startsWith('cd') || line.trim().startsWith('cat') || line.trim().startsWith('whoami') || line.trim().startsWith('help') || line.trim().startsWith('clear') || line.trim().startsWith('echo')) {
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

    if (currentPage === 'chat' && !showTerminal) {
        return (
            <div className="w-screen h-screen flex flex-col bg-gray-950">
                 <div className="w-full h-full flex flex-col bg-gray-900 rounded-none shadow-2xl overflow-hidden border border-gray-700">
                    <GnomeTitleBar 
                        title="Chat - Nuit de l'Apéro"
                        onClose={() => setCurrentPage('home')}
                    />

                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-900 space-y-4">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-bold text-sm ${msg.type === 'user' ? 'text-blue-400' : msg.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{msg.author}</span>
                                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                    </div>
                                    <div className={`px-4 py-2 rounded-lg max-w-2xl text-sm ${msg.type === 'user' ? 'bg-blue-600 text-white ml-auto' : msg.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="bg-gray-800 p-4 border-t border-gray-700 flex items-center gap-2">
                            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()} placeholder={`Message en tant que ${userName}...`} className="flex-1 bg-gray-700 outline-none text-white text-sm px-3 py-2 rounded border border-gray-600 placeholder-gray-500" autoFocus />
                            <button onClick={sendChatMessage} className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition">
                                <Send size={18} />
                            </button>
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

    return (
        <div className="w-screen h-screen overflow-hidden flex flex-col" style={{ backgroundImage: 'url(/fond_ecran.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
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
                    
                    {/* Terminal */}
                    <div onClick={() => handleDockClick(() => setShowTerminal(true))} className={`w-12 h-12 bg-black rounded-lg flex items-center justify-center hover:scale-110 transition cursor-pointer shadow-md p-1 border overflow-hidden border-purple-600`}>
                        <img src="/logo.png" alt="Terminal" className="w-full h-full object-cover rounded" />
                    </div>

                    {/* Manuel (HELP) */}
                    <div onClick={() => handleDockClick(() => setShowManual(true))} className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 transition cursor-pointer shadow-md p-1 border border-yellow-500`}>
                        <BookOpen size={24} className="text-yellow-400" />
                    </div>

                    {/* Chat */}
                    <div onClick={() => handleDockClick(() => setCurrentPage('chat'))} className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 transition cursor-pointer shadow-md p-1 border border-blue-400`}>
                        <MessageCircle size={24} className="text-blue-400" />
                    </div>

                    {/* Team/Fichier equipe.txt - ICÔNE RETIRÉE DU DOCK */}

                    <div className="flex-1"></div>
                    
                    {/* Icône de Paramètres (Utilisateur) - TOUJOURS ACCESSIBLE */}
                    <div onClick={openSettings} className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:scale-110 transition cursor-pointer shadow-md p-1 mb-4">
                         <User size={24} className="text-gray-400" />
                    </div>
                </div>

                {/* Contenu Principal du Bureau (VIDE) */}
                <div className="flex-1 p-12 overflow-hidden relative">
                    {/* Le bureau reste vide, la navigation se fait par le Terminal ou les modales. */}
                </div>
            </div>
        </div>
    );
};

export default UbuntuDesktop;