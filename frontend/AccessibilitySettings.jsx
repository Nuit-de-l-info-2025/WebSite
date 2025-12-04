import React from 'react';
import { User } from 'lucide-react';

const AccessibilitySettings = ({
    userName,
    showSettings,
    setShowSettings,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    systemSounds,
    setSystemSounds,
    reducedMotion,
    setReducedMotion,
    largeCursor,
    setLargeCursor,
}) => {
    // Ne rien afficher si la modale ne doit pas être visible
    if (!showSettings) return null;

    const LOGIN_NAME = 'nuit-de-l-apero'; 
    // Note: Le GnomeTitleBar a été déplacé dans App.jsx dans votre dernière version.
    // Pour que le style fonctionne ici, nous utilisons le style directement.

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
            <div className="w-[500px] bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <User size={20} className="mr-2 text-yellow-400" /> Paramètres d'Accessibilité
                </h2>
                
                {/* Section Utilisateur */}
                <div className="mb-6 pb-4 border-b border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Utilisateur</h3>
                    <div className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded">
                        <span className="text-gray-400 text-sm">Nom d'affichage:</span>
                        <span className="text-white font-medium">{userName}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Identifiant terminal: {LOGIN_NAME}@ubuntu</p>
                </div>

                {/* Section Accessibilité */}
                <div className="space-y-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Options d'Accessibilité</h3>
                    
                    {/* Taille du texte */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Taille du texte du terminal</label>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setFontSize('small')}
                                className={`px-3 py-1 text-white text-xs rounded transition ${fontSize === 'small' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                Petit
                            </button>
                            <button 
                                onClick={() => setFontSize('normal')}
                                className={`px-3 py-1 text-white text-xs rounded transition ${fontSize === 'normal' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                Normal
                            </button>
                            <button 
                                onClick={() => setFontSize('large')}
                                className={`px-3 py-1 text-white text-xs rounded transition ${fontSize === 'large' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                Grand
                            </button>
                        </div>
                    </div>

                    {/* Contraste élevé */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm text-gray-400">Contraste élevé</label>
                            <p className="text-xs text-gray-500">Améliore la lisibilité</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={highContrast}
                                onChange={(e) => setHighContrast(e.target.checked)}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    {/* Sons */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm text-gray-400">Sons du système</label>
                            <p className="text-xs text-gray-500">Notifications sonores</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={systemSounds}
                                onChange={(e) => setSystemSounds(e.target.checked)}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    {/* Animations */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm text-gray-400">Animations réduites</label>
                            <p className="text-xs text-gray-500">Réduit les mouvements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={reducedMotion}
                                onChange={(e) => setReducedMotion(e.target.checked)}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    {/* Curseur agrandi */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm text-gray-400">Curseur agrandi</label>
                            <p className="text-xs text-gray-500">Plus facile à repérer</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={largeCursor}
                                onChange={(e) => setLargeCursor(e.target.checked)}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={() => setShowSettings(false)} 
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessibilitySettings;