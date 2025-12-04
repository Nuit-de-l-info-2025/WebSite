import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

// Composant de Barre de Titre (réutilisé pour la cohérence)
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


const ChatScreen = ({ userName, setCurrentPage }) => {
    
    // --- États Spécifiques au Chat ---
    const [chatMessages, setChatMessages] = useState([
        { type: 'system', text: 'Bienvenue au chat!', author: 'Nuit de l\'Apéro', timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        // Défilement automatique vers le bas lors de l'ajout d'un message
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);


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

        // Simulation de la réponse de l'assistant après un court délai
        setTimeout(() => {
            setChatMessages(prev => [...prev, { 
                type: 'assistant', 
                text: `Salut ${userName} ! Je suis l'assistant de Nuit de l'Apéro. Que puis-je faire pour toi ?`,
                author: 'Nuit de l\'Apéro',
                timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 500);
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-950">
             <div className="w-full h-full flex flex-col bg-gray-900 rounded-none shadow-2xl overflow-hidden border border-gray-700">
                
                <GnomeTitleBar 
                    title="Chat - Nuit de l'Apéro"
                    // Ferme le chat en revenant à la page 'home'
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
                        <input 
                            type="text" 
                            value={chatInput} 
                            onChange={(e) => setChatInput(e.target.value)} 
                            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()} 
                            placeholder={`Message en tant que ${userName}...`} 
                            className="flex-1 bg-gray-700 outline-none text-white text-sm px-3 py-2 rounded border border-gray-600 placeholder-gray-500" 
                            autoFocus 
                        />
                        <button onClick={sendChatMessage} className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatScreen;