import React, { useRef, useState } from 'react';
import { X, Dumbbell } from 'lucide-react';

// Le chemin d'accès au contenu HTML statique ou simulé de l'Index
// Assurez-vous que cette constante est la même que dans UbuntuDesktop.jsx
const INDEX_HTML_PATH = '/index.html'; 

/**
 * Composant Modale pour afficher l'application Index dans une iframe ou son contenu.
 */
const IndexScreen = ({ showIndex, setShowIndex, simulateTerminalCloseHistory }) => {
    
    // États de base pour simuler le déplacement (draggable) de la fenêtre
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 }); 
    const dragOffset = useRef({ x: 0, y: 0 });

    // La modale n'est rendue que si showIndex est vrai
    if (!showIndex) return null;

    // --- Fonctions de Drag ---
    const handleMouseDown = (e) => {
        // Clic sur la barre de titre (ou la poignée draggable-handle)
        if (!e.target.closest('.draggable-handle')) return;

        e.preventDefault();
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Fonction de fermeture qui simule le 'close' dans le terminal
    const handleClose = () => {
        if (simulateTerminalCloseHistory) {
            simulateTerminalCloseHistory();
        }
        setShowIndex(false); // Utilise setShowIndex
        setPosition({ x: 0, y: 0 }); // Réinitialiser la position au centrage
    };


    return (
        <div 
            className={`fixed flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700 pointer-events-auto z-[60] 
                         w-[95vw] h-[95vh] max-w-[1000px] max-h-[800px]`}
            style={{
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`, 
                top: '50%',
                left: '50%',
                cursor: isDragging ? 'grabbing' : 'default',
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Barre de titre GNOME simplifiée pour Index */}
            <div 
                className="flex-shrink-0 h-8 bg-gray-800 flex items-center justify-between px-2 border-b border-gray-700 cursor-grab draggable-handle"
            >
                <div className="flex space-x-2">
                    <button 
                        onClick={handleClose} 
                        className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition group relative flex items-center justify-center"
                    >
                        <X size={8} className="text-red-900 opacity-0 group-hover:opacity-100 transition pointer-events-none" /> 
                    </button>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-50 cursor-not-allowed"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full opacity-50 cursor-not-allowed"></div>
                </div>
                {/* Titre spécifique à l'application Index */}
                <div className="flex items-center flex-1 justify-center text-gray-400 text-xs font-sans select-none">
                    <Dumbbell size={12} className="mr-1 text-orange-400" /> INDEX APPLICATION
                </div>
                <div className="w-[45px]"></div>
            </div>
            
            {/* Contenu de l'application Index : Iframe */}
            <iframe 
                // Utilisez le chemin d'accès INDEX_HTML_PATH
                src={INDEX_HTML_PATH} 
                title="Index Application" 
                className="flex-1 w-full h-full border-0 bg-black" 
            />

        </div>
    );
};

export default IndexScreen;