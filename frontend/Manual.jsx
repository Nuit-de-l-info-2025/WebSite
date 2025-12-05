import React, { useEffect, useRef, useState, useCallback } from 'react'; 
import { X } from 'lucide-react';

// Composant de Barre de Titre GNOME (inchangé)
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


const Manual = ({ showManual, setShowManual, manualContent }) => {
    
    const windowRef = useRef(null);
    
    // Position et taille initiales (en px)
    const [position, setPosition] = useState({ 
        x: window.innerWidth * 0.1 + 30, // Position initiale décalée
        y: window.innerHeight * 0.1 + 30 
    });
    const [size, setSize] = useState({ // Taille initiale (~80% de l'écran)
        width: Math.min(window.innerWidth * 0.8, 1200),
        height: Math.min(window.innerHeight * 0.8, 800)
    });

    // États de Drag
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // --- NOUVEAUX ÉTATS POUR LE REDIMENSIONNEMENT ---
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState(null); 
    const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
    const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });

    // Rendre la fenêtre légèrement décalée par rapport au Terminal
    useEffect(() => {
        if (showManual) {
            // Recalcule la position au centre + décalage
            const initialX = window.innerWidth * 0.1 + 30;
            const initialY = window.innerHeight * 0.1 + 30;
            setPosition({ x: initialX, y: initialY });
        }
    }, [showManual]);


    // Logique de Drag (début) - Déclenché par la barre de titre
    const handleMouseDown = useCallback((e) => {
        if (e.button !== 0 || !windowRef.current) return; 

        const windowRect = windowRef.current.getBoundingClientRect();
        
        setOffset({
            x: e.clientX - windowRect.left,
            y: e.clientY - windowRect.top,
        });
        setIsDragging(true);
    }, []);

    // Logique de Redimensionnement (début) - Déclenché par les poignées
    const handleResizeMouseDown = useCallback((e, direction) => {
        e.stopPropagation(); // Empêche le drag de démarrer en même temps
        if (e.button !== 0 || !windowRef.current) return; 

        setIsResizing(true);
        setResizeDirection(direction);
        setInitialMousePos({ x: e.clientX, y: e.clientY });
        setInitialSize({ 
            width: windowRef.current.clientWidth, 
            height: windowRef.current.clientHeight 
        });
    }, []);


    // Logique de Drag/Redimensionnement (mouvement)
    const handleMouseMove = useCallback((e) => {
        
        // --- LOGIQUE DE DRAG ---
        if (isDragging && !isResizing && windowRef.current) {
            let newX = e.clientX - offset.x;
            let newY = e.clientY - offset.y;

            // Limiter le déplacement à l'intérieur de l'écran
            newX = Math.max(0, Math.min(newX, window.innerWidth - windowRef.current.clientWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - windowRef.current.clientHeight));

            setPosition({ x: newX, y: newY });
            return;
        }

        // --- LOGIQUE DE REDIMENSIONNEMENT ---
        if (isResizing && windowRef.current) {
            const dx = e.clientX - initialMousePos.x;
            const dy = e.clientY - initialMousePos.y;
            
            let newWidth = initialSize.width;
            let newHeight = initialSize.height;
            
            const MIN_WIDTH = 400; // Minimum défini dans le style
            const MIN_HEIGHT = 150; // Nouveau minimum raisonnable

            // Redimensionnement par la droite
            if (resizeDirection && resizeDirection.includes('right')) {
                newWidth = Math.max(MIN_WIDTH, initialSize.width + dx);
                // Limite max à droite (pour ne pas sortir de l'écran)
                const maxRight = window.innerWidth - position.x;
                newWidth = Math.min(newWidth, maxRight);
            }

            // Redimensionnement par le bas
            if (resizeDirection && resizeDirection.includes('bottom')) {
                newHeight = Math.max(MIN_HEIGHT, initialSize.height + dy);
                // Limite max en bas (pour ne pas sortir de l'écran)
                const maxBottom = window.innerHeight - position.y;
                newHeight = Math.min(newHeight, maxBottom);
            }
            
            setSize({ width: newWidth, height: newHeight });
        }
        
    }, [isDragging, isResizing, offset, initialMousePos, initialSize, position, resizeDirection]);

    // Logique de Drag/Redimensionnement (fin)
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false); // Arrêter le redimensionnement
        setResizeDirection(null); 
    }, []);

    // Gérer les événements globaux
    useEffect(() => {
        if (isDragging || isResizing) { // AJOUT DE isResizing
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
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);


    if (!showManual) return null;
    
    // Styles pour la position et la taille
    const windowStyle = { 
        top: `${position.y}px`, 
        left: `${position.x}px`,
        width: `${size.width}px`, // Utilisation de l'état 'size'
        height: `${size.height}px`, // Utilisation de l'état 'size'
        minWidth: '400px', // Garde les minimums
        minHeight: '150px', // Nouveau minimum pour le redimensionnement
    };

    return (
        <div 
            ref={windowRef} 
            className="fixed z-50 flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700 transition-shadow duration-300"
            style={windowStyle} // Application des styles de position et taille
        >
            <GnomeTitleBar 
                title="Manuel de Bord (Man Page)"
                onClose={() => setShowManual(false)}
                onMouseDown={handleMouseDown} // Drag via la barre de titre
            />
            <div className="flex-1 overflow-y-auto p-8 bg-gray-900 text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                <pre className="text-yellow-400 mb-4 font-bold text-lg">
                    {manualContent.split('\n').map((line, index) => {
                        let coloredLine = line;
                        if (line.includes('COMMANDES DISPONIBLES') || line.includes('DOSSIERS ACCESSIBLES') || line.includes('FICHIERS ACCESSIBLES')) {
                            coloredLine = <span className="text-orange-400 font-bold">{line}</span>;
                        } 
                        else if (line.trim().startsWith('help') || line.trim().startsWith('ls') || line.trim().startsWith('cd') || line.trim().startsWith('cat') || line.trim().startsWith('whoami') || line.trim().startsWith('clear') || line.trim().startsWith('echo') || line.trim().startsWith('man') || line.trim().startsWith('chat')) {
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
    );
};

export default Manual;