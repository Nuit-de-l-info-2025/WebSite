import React, { useEffect, useRef, useState, useCallback } from 'react'; 
import { X } from 'lucide-react';

// Composant de Barre de Titre GNOME
const GnomeTitleBar = ({ title, onClose, onMouseDown }) => ( 
    <div 
        className="flex-shrink-0 h-8 bg-gray-800 flex items-center justify-between px-2 border-b border-gray-700 cursor-move" 
        onMouseDown={onMouseDown} 
    >
        <div className="flex space-x-2">
            <button onClick={onClose} className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition group relative">
                <X size={8} className="absolute inset-0 m-auto text-red-900 opacity-0 group-hover:opacity-100 transition" />
            </button>
            <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-50 cursor-not-allowed"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full opacity-50 cursor-not-allowed"></div>
        </div>
        <div className="flex items-center flex-1 justify-center text-gray-400 text-xs font-sans select-none pointer-events-none"> 
            {title}
        </div>
        <div className="w-[45px]"></div>
    </div>
);


const Terminal = ({
    showTerminal,
    setShowTerminal,
    currentPage,
    commandHistory,
    input,
    setInput,
    executeCommand,
    handleTabCompletion,
    fontSize,
    highContrast,
    LOGIN_NAME,
}) => {
    
    const terminalEndRef = useRef(null);
    const windowRef = useRef(null);
    
    // Position et état de drag. Position initiale fixée à 10% du bord.
    const [position, setPosition] = useState({ x: window.innerWidth * 0.1, y: window.innerHeight * 0.1 }); 
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    
    // Défilement automatique
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [commandHistory]);

    // Logique de Drag (début)
    const handleMouseDown = useCallback((e) => {
        if (e.button !== 0 || !windowRef.current) return; 

        const windowRect = windowRef.current.getBoundingClientRect();
        
        setOffset({
            x: e.clientX - windowRect.left,
            y: e.clientY - windowRect.top,
        });
        setIsDragging(true);
    }, []);

    // Logique de Drag (mouvement)
    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !windowRef.current) return;
        
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;

        // Limiter le déplacement
        newX = Math.max(0, Math.min(newX, window.innerWidth - windowRef.current.clientWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - windowRef.current.clientHeight));

        setPosition({ x: newX, y: newY });
    }, [isDragging, offset]);

    // Logique de Drag (fin)
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Gérer les événements globaux
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);


    if (!showTerminal) return null;

    // Définition des classes en fonction des états d'accessibilité
    const terminalBgClass = highContrast ? 'bg-black' : 'bg-gray-950';
    const terminalTextClass = highContrast ? 'text-lime-400' : 'text-green-400';
    const terminalFontSizeClass = fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-lg' : 'text-sm';

    return (
        // Remplacement de l'ancien wrapper plein écran par la fenêtre elle-même, en position "fixed"
        <div 
            ref={windowRef} 
            className="fixed z-50 flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700 transition-shadow duration-300"
            style={{ 
                // Utiliser directement les états X et Y comme coordonnées absolues
                top: `${position.y}px`, 
                left: `${position.x}px`,
                width: '80vw',
                height: '80vh',
                maxWidth: '90vw', 
                maxHeight: '90vh',
                minWidth: '400px',
            }}
        >
            <GnomeTitleBar 
                title={`${LOGIN_NAME}@ubuntu: ~/${currentPage} - Terminal`}
                onClose={() => setShowTerminal(false)}
                onMouseDown={handleMouseDown} 
            />

            <div className={`flex-1 flex flex-col overflow-hidden ${terminalBgClass}`}>
                <div className={`flex-1 overflow-y-auto p-4 font-mono leading-relaxed ${terminalBgClass} ${terminalTextClass} ${terminalFontSizeClass}`}>
                    {commandHistory.map((line, idx) => (
                        <div key={idx} className="whitespace-pre-wrap break-all">{line}</div>
                    ))}
                    <div ref={terminalEndRef} />
                </div>

                <div className="bg-gray-900 p-3 border-t border-gray-800 flex items-center gap-2 font-mono">
                    <span className={terminalTextClass}>{LOGIN_NAME}@ubuntu:~/{currentPage}$</span>
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
    );
};

export default Terminal;