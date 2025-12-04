import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Terminal, BookOpen, MessageCircle } from 'lucide-react';

const UbuntuDesktop = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [commandHistory, setCommandHistory] = useState([
    'Welcome to Ubuntu 22.04 LTS',
    '',
  ]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState(['help', 'ls', 'cd about']);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualContent, setManualContent] = useState(`╔═══════════════════════════════════════════════════════════════════╗
║          MANUEL - Nuit de l'Info 2025                           ║
║       Guide Complet de Navigation du Site                       ║
╚═══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 PAGES DISPONIBLES:

🏠 HOME (Accueil)
   Commande: cd home
   Commandes: help, ls, cat about.txt, cd about, cd projets, cd equipe, cd contact, cd chat

ℹ️ ABOUT (À propos)
   Commande: cd about
   Commandes: whoami, cat about.txt, cd equipe, cd ..

👥 EQUIPE (Équipe)
   Commande: cd equipe
   Commandes: whoami, cat equipe.txt, cd ..

📋 PROJETS (Projets)
   Commande: cd projets
   Commandes: ls, cat projets.txt, cd ..

📞 CONTACT (Contact)
   Commande: cd contact
   Commandes: echo "Message", mail, cd chat, cd ..

💬 CHAT (Chat)
   Commande: cd chat
   Commandes: help, cd ..

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⌨️ COMMANDES GÉNÉRALES:

  ls              → Lister tous les répertoires
  cd [page]       → Aller à une page
  cd ..           → Retour à l'accueil
  cat [file.txt]  → Afficher le contenu
  whoami          → Infos équipe
  help            → Afficher l'aide
  clear           → Effacer l'écran
  echo "texte"    → Afficher un message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ASTUCES:

  • Tapez "ls" pour voir tous les répertoires
  • Utilisez "cd" pour naviguer
  • Cliquez sur les suggestions en bas
  • Le chat s'ouvre avec "cd chat"

🌙 Nuit de l'Info 2025 - Équipe d'Innovation`);
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: 'Bienvenue au chat!', author: 'Nuit de l\'Apéro', timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const terminalEndRef = useRef(null);
  const chatEndRef = useRef(null);

  const API_URL = 'http://localhost:5000/api';

  const pages = {
    home: { name: 'home', title: 'Accueil' },
    about: { name: 'about', title: 'À propos' },
    contact: { name: 'contact', title: 'Contact' },
    chat: { name: 'chat', title: 'Chat' },
    projets: { name: 'projets', title: 'Projets' },
    equipe: { name: 'equipe', title: 'Équipe' }
  };

  useEffect(() => {
    fetchPageInfo(currentPage);
    // Nettoyer le terminal quand on change de page
    setCommandHistory([`nuit-apero@ubuntu:~/${currentPage}$ `, '']);
  }, [currentPage]);

  const fetchPageInfo = async (page) => {
    try {
      const res = await fetch(`${API_URL}/pages/${page}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.commands || []);
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const executeCommand = async () => {
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    setCommandHistory(prev => [...prev, `nuit-apero@ubuntu:~/${currentPage}$ ${cmd}`]);
    setInput('');

    if (cmd === 'ls') {
      const pageList = Object.keys(pages).map(p => p + '/').join('\n');
      setCommandHistory(prev => [...prev, pageList, '']);
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

    try {
      const res = await fetch(`${API_URL}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd, currentPage })
      });
      if (res.ok) {
        const data = await res.json();
        setCommandHistory(prev => [...prev, data.output || '', '']);
        if (data.nextPage) {
          setCurrentPage(data.nextPage);
        }
      }
    } catch (err) {
      setCommandHistory(prev => [...prev, `Erreur: ${err.message}`, '']);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { 
      type: 'user', 
      text: userMsg,
      author: 'maelh',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatInput('');

    try {
      const res = await fetch(`${API_URL}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: `echo "${userMsg}"`, currentPage: 'chat' })
      });
      if (res.ok) {
        const data = await res.json();
        setTimeout(() => {
          setChatMessages(prev => [...prev, { 
            type: 'assistant', 
            text: data.output,
            author: 'Nuit de l\'Apéro',
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 300);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { 
        type: 'error', 
        text: `Erreur: ${err.message}`,
        author: 'System',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const openManual = () => {
    const manualText = `╔═══════════════════════════════════════════════════════════════════╗
║          MANUEL - Nuit de l'Info 2025                           ║
║       Guide Complet de Navigation du Site                       ║
╚═══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 PAGES DISPONIBLES:

🏠 HOME (Accueil)
   Commande: cd home
   Commandes: help, ls, cat about.txt, cd about, cd projets, cd equipe, cd contact, cd chat

ℹ️ ABOUT (À propos)
   Commande: cd about
   Commandes: whoami, cat about.txt, cd equipe, cd ..

👥 EQUIPE (Équipe)
   Commande: cd equipe
   Commandes: whoami, cat equipe.txt, cd ..

📋 PROJETS (Projets)
   Commande: cd projets
   Commandes: ls, cat projets.txt, cd ..

📞 CONTACT (Contact)
   Commande: cd contact
   Commandes: echo "Message", mail, cd chat, cd ..

💬 CHAT (Chat)
   Commande: cd chat
   Commandes: help, cd ..

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⌨️ COMMANDES GÉNÉRALES:

  ls              → Lister tous les répertoires
  cd [page]       → Aller à une page
  cd ..           → Retour à l'accueil
  cat [file.txt]  → Afficher le contenu
  whoami          → Infos équipe
  help            → Afficher l'aide
  clear           → Effacer l'écran
  echo "texte"    → Afficher un message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ASTUCES:

  • Tapez "ls" pour voir tous les répertoires
  • Utilisez "cd" pour naviguer
  • Cliquez sur les suggestions en bas
  • Le chat s'ouvre avec "cd chat"

🌙 Nuit de l'Info 2025 - Équipe d'Innovation`;
    
    setManualContent(manualText);
    setShowManual(true);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (showTerminal) {
    return (
      <div className="w-screen h-screen flex flex-col bg-gray-950">
        <div className="z-10 bg-gray-900 h-11 flex items-center px-4 border-b border-gray-800">
          <Terminal size={18} className="text-green-400 mr-2" />
          <div className="flex-1 text-white text-sm font-mono">Terminal - {currentPage.toUpperCase()}</div>
          <button onClick={() => setShowTerminal(false)} className="hover:bg-red-600 p-2 rounded text-gray-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        <div className="z-10 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 bg-gray-950 text-green-400 font-mono text-sm leading-relaxed">
            {commandHistory.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap break-all">{line}</div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {suggestions.length > 0 && (
            <div className="bg-gray-900 p-4 border-t border-gray-800">
              <div className="text-xs text-green-600 mb-3 font-mono">Available commands:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((cmd, idx) => (
                  <button key={idx} onClick={() => handleSuggestionClick(cmd)} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-green-600 rounded text-xs text-green-400 transition cursor-pointer font-mono">
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-900 p-4 border-t border-gray-800 flex items-center gap-2 font-mono">
            <span className="text-green-400">nuit-apero@ubuntu:~/{currentPage}$</span>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && executeCommand()} className="flex-1 bg-transparent outline-none text-green-400 text-sm font-mono" autoFocus />
          </div>
        </div>
      </div>
    );
  }

  if (showManual) {
    return (
      <div className="w-screen h-screen flex flex-col bg-yellow-50">
        <div className="bg-red-900 h-11 flex items-center px-4 border-b-2 border-yellow-900">
          <BookOpen size={18} className="text-yellow-200 mr-2" />
          <div className="flex-1 text-yellow-100 text-sm font-mono font-bold">MANUEL</div>
          <button onClick={() => setShowManual(false)} className="hover:bg-red-800 p-2 rounded text-yellow-100 transition">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-yellow-50 text-gray-900 font-mono text-sm leading-relaxed">
          <pre className="whitespace-pre-wrap break-words">{manualContent}</pre>
        </div>
      </div>
    );
  }

  if (currentPage === 'chat' && !showTerminal) {
    return (
      <div className="w-screen h-screen flex flex-col bg-gray-950">
        <div className="bg-gray-900 h-11 flex items-center px-4 border-b border-gray-800">
          <MessageCircle size={18} className="text-blue-400 mr-2" />
          <div className="flex-1 text-white text-sm font-mono">Chat - Nuit de l'Apéro</div>
          <button onClick={() => setCurrentPage('home')} className="hover:bg-red-600 p-2 rounded text-gray-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

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
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()} placeholder="Votre message..." className="flex-1 bg-gray-700 outline-none text-white text-sm px-3 py-2 rounded border border-gray-600 placeholder-gray-500" autoFocus />
            <button onClick={sendChatMessage} className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col" style={{ backgroundImage: 'url(/fond_ecran.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <div className="bg-gray-950 bg-opacity-95 h-10 flex items-center px-4 shadow-lg border-b border-gray-800">
        <div className="text-white text-sm font-semibold">Activities</div>
        <div className="flex-1 flex justify-center">
          <div className="text-white text-xs font-mono">{new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
        </div>
        <div className="text-white text-xs font-mono">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-20 bg-gray-950 bg-opacity-95 flex flex-col items-center py-4 gap-4 border-r border-gray-800 shadow-lg">
          <div className="w-12 h-12 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-xl hover:scale-110 transition cursor-pointer">🅤</div>
          
          <div onClick={() => setShowTerminal(true)} className="w-12 h-12 bg-black rounded flex items-center justify-center hover:scale-110 transition cursor-pointer border border-green-500 overflow-hidden">
            <img src="/logo.png" alt="Terminal" className="w-full h-full object-cover rounded" />
          </div>

          <div onClick={() => setShowManual(true)} className="w-12 h-12 bg-red-900 rounded flex items-center justify-center hover:scale-110 transition cursor-pointer border border-yellow-500">
            <BookOpen size={24} className="text-yellow-300" />
          </div>

          <div onClick={() => { setCurrentPage('chat'); }} className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center hover:scale-110 transition cursor-pointer border border-blue-400">
            <MessageCircle size={24} className="text-blue-300" />
          </div>

          <div className="flex-1"></div>
          <div className="text-gray-600 text-xs mb-4 cursor-pointer hover:text-gray-400">⚙️</div>
        </div>

        <div className="flex-1 p-12 overflow-hidden relative"></div>
      </div>
    </div>
  );
};

export default UbuntuDesktop;