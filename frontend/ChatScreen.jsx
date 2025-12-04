import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Smile, User } from 'lucide-react'; 

// --- BASE DE DONNÉES MASSIVE POUR GÉNÉRER DES DIZAINES DE MILLIERS DE COMBINAISONS ---

const PAYSAN_BANK = {
    // 1. Démarrage de la phrase (Le sujet principal)
    // *** AUGMENTATION DE LA DIVERSITÉ DES SUJETS DE DÉPART ***
    subjects: [
        // Général & Tech
        "Ton affaire de logiciel là,",
        "C'te bidouille d'internet,",
        "La question que tu me poses,",
        "Ce 'code' dont tu parles,",
        "Toute cette technologie,",
        "Parler d'un 'bug', c'est comme dire que",
        "Ce que tu expliques,",
        "J'ai la même chose quand",
        "Le temps de séchage du bois de chauffage,",
        "La dernière fois qu'on a vu la lune rousse,",
        // Nouveaux sujets
        "Le moulin à vent du grand-père,",
        "La vieille radio dans la grange,",
        "L'odeur du purin frais,",
        "Quand on met les bottes en caoutchouc,",
        "La dernière fois que j'ai pêché,",
        "Le moteur du motoculteur qui pète,",
        "La recette de la tarte aux pruneaux,",
        "L'aiguille de la boussole de mon oncle,",
        "Les vélos rouillés derrière le hangar,",
        "Les conversations à la foire agricole,",
        "Le bruit du tonnerre en juillet,",
        "Le chat qui chasse les taupes sous le cerisier,",
        "Le vieux puits asséché dans le fond du jardin,",
        "La couleur du ciel après l'orage,",
        "Les outils oubliés dans la boue,",
    ],
    // 2. Le verbe ou la comparaison paysanne loufoque
    comparisons: [
        "a la même utilité que",
        "est aussi embrouillé que",
        "ressemble étrangement à",
        "me fait penser au",
        "vaut pas l'effort de",
        "est plus tordu que",
        "ça n'est pas plus logique que",
        "c'est l'équivalent de",
        "ça me fait l'effet de",
        "ça glisse comme",
        "ça n'a ni queue ni tête comme",
        "c'est plus rapide que",
        "ça fait un bruit bizarre comme",
        "ça va finir comme",
        "ça s'installe lentement comme",
        "ça s'oublie aussi vite que",
        "ça va nulle part comme",
        "ça tourne en rond comme",
        "ça sent le roussi comme",
        "ça coule sans s'arrêter comme",
    ],
    // 3. Les objets ou situations rustiques et décalées
    objects: [
        "le foin quand il est mouillé après la grêle. ⛈️",
        "le chemin de la ferme après trois jours de pluie diluvienne. 🌧️",
        "une poule qui essaie d'apprendre l'allemand à la radio. 🐔",
        "une cuillère en bois dans une botte de paille oubliée. 🌾",
        "le trou de souris dans la cave à vin où y'a plus de vin. 🐭",
        "le moteur de la vieille moissonneuse batteuse qui tourne à l'eau. 🚜",
        "les factures d'électricité de la grange non isolée. ⚡",
        "un mouton qui fait la grève du bêlement devant le portail. 🐑",
        "le chapeau du curé qui s'envole en pleine messe de mariage. 👒",
        "la chèvre qui mange le journal du dimanche entier. 🐐",
        "l'eau de vaisselle après avoir lavé les outils de fumier. 💦",
        "un épouvantail en pleine crise existentielle. 🧍",
        "un nid de frelons dans un vieux bidon d'huile. 🐝",
        "le bruit du grillon quand il a trop bu. 🦗",
        "la vieille charrue qui roule toute seule dans le champ. 🛒",
        "un champ de navets où tous les navets ont disparu. 🥕",
        "le vieux chien qui essaie de rattraper sa queue. 🐕",
        // L'élément répétitif que vous avez mentionné est ici.
        "le pain rassis oublié derrière le poêle. 🍞", 
        "le filet de pêche plein de vieilles chaussettes. 🎣",
        "la roue du vélo qui tourne dans le vide. 🚲",
        "un nuage qui a la forme d'un lapin borgne. ☁️",
        "une vieille boîte de sardines vide et rouillée. 🥫",
        "la confiture de coing qui a collé au fond de la casserole. 🍯",
        "une porte de grange qui grince depuis 10 ans. 🚪",
    ],
    // 4. La conclusion/morale (l'élément final qui rend la phrase unique)
    conclusions: [
        "Et puis, l'essentiel, c'est d'avoir de bonnes pommes de terre. 🥔",
        "Moi, je dis qu'il faut en parler au cochon, il comprendra mieux. 🐷",
        "Enfin, je crois. J'ai peut-être bu un coup de trop ce midi. 🍷",
        // L'élément répétitif que vous avez mentionné est ici.
        "Alors, on ferait mieux d'aller voir si les œufs sont frais, hein. 🍳", 
        "Ce qui nous ramène au prix du gazole. Ça, c'est un vrai problème. ⛽",
        "Faut laisser le temps au temps, comme le vin qui fermente. 🍇",
        "Tu devrais plutôt t'acheter une brouette neuve. C'est plus solide. 🛠️",
        "C'est comme ça qu'on a perdu le chat roux l'an dernier. C'est clair, non ? 🐈",
        "Le chien, lui, il s'en fout. Il dort déjà. 😴",
        "M'enfin ! La lune est rouge ce soir, ça veut dire quelque chose ça ! 🌕",
        "Demande plutôt à ma femme, elle s'y connaît mieux en potins de village. 👵",
        "Ça n'arrangera pas la fuite du tuyau, ça c'est sûr. 🚽",
        "Faudrait d'abord penser à vidanger le réservoir du tracteur. 🔧",
        "C'est comme le vent qui emporte la paille, on ne sait jamais où ça va atterrir. 💨",
        "Il faudrait d'abord trouver le marteau que j'ai perdu en 95. Ça, c'est important. 🔨",
        "Le facteur, lui, il s'est jamais perdu avec ça. ✉️",
    ],
    // 5. Réponses complètes (pour plus de variation dans la structure) - Mode aléatoire
    full_sentences: [
        "J'ai pas le temps, j'ai les salades qui attendent au jardin. On reparle de tout ça après la récolte. 🥬",
        "Je suis désolé mon gars, mais j'étais en train de caresser les vaches. J'ai pas bien écouté. C'était quoi déjà la question ? 🐄",
        "Tout ça, c'est bien beau, mais c'est quand qu'on mange ? Moi, quand je réfléchis trop, j'ai faim. 🥖",
        "Tu devrais éteindre et rallumer. Si ça marche pas, change le pneu de la charrette. C'est la seule solution que je connais. 🔧",
        "Si ça continue, je débranche tout et je prends ma retraite dans un poulailler. Au moins, là, je sais qui je suis. 🏡",
        "La dernière fois qu'on m'a parlé de 'serveur', c'était le serveur de bière à la fête du village. Et il était bon, lui ! 🍻",
        "J'ai vu un avion voler à l'envers, ça doit être pour ça que ton ordinateur fait des siennes. Faut demander aux oiseaux ! 🐦",
        "Mon grand-père disait : quand tu as un doute, bois un petit coup. C'est la meilleure réponse à tout. 🥃",
        "Bonjour ! C'est l'IA Paysanne, et aujourd'hui, j'ai plus de questions que de réponses. Qu'est-ce que tu me veux, l'ami ? 🤷",
        "Dis donc, ça sent le cramé ici, ou c'est juste ton truc d'ordinateur ? 💨",
        "Les oies sont en train de marcher en ligne droite. Ça, c'est un signe. Fais comme elles. 🦢",
        "Le fait est que mon chat dort sur le clavier. On en reparle après sa sieste. 🐈‍⬛",
    ],
    
    // --- NOUVELLE SECTION POUR LA LOGIQUE (MOTS-CLÉS) ---
    keyword_responses: {
        // Mots-clés informatiques/techniques
        code: [
            "Le code ? Ça, c'est le truc que j'ai mis sur le portail pour que les chèvres n'ouvrent pas. Le tien doit être aussi solide. 🐐",
            "Ton 'code' est cassé ? Essaie de le taper plus fort sur la table, des fois ça marche avec le tracteur. 🚜",
            "J'ai appris le 'code de la route' en 1978. Si ça t'aide, je peux t'expliquer le panneau 'Danger vaches'. ⚠️",
        ],
        bug: [
            "Un bug ? C'est sûrement le hanneton qui est entré dans la prise. Mets un coup de balai, ça règlera le problème. 🧹",
            "Les bugs, nous, on les donne aux poules. Ça, c'est de la logique paysanne ! 🐔",
            "Si t'as un bug, ça veut dire que le logiciel, c'est comme une laitue avec une limace dedans. Faut la jeter ! 🥬",
        ],
        internet: [
            "Internet ? Ça, c'est le grand tuyau invisible par où passent les potins de village. Et ça rame comme mon voisin quand il a bu trop de cidre. 🍺",
            "Pour avoir internet, faut monter sur le toit de la grange. Et même là, faut pas pleuvoir. 🌧️",
            "Je préfère encore parler au pigeon voyageur. Lui au moins, il est fiable. 🐦",
        ],
        argent: [
            "L'argent ? C'est ce qui manque toujours quand le prix du blé baisse. Ton problème est plus facile à régler, c'est sûr. 💰",
            "L'argent pousse pas dans les champs, mon gars. Laisse tomber ton ordinateur et viens labourer un peu. 🌾",
            "Si ça coûte cher, ça ne sert à rien. Règle universelle de la ferme. 🤷",
        ],
        aide: [
            "De l'aide ? Tu cherches l'aiguille dans la botte de foin. Moi, je te propose un bon apéro, c'est plus efficace. 🍷",
            "T'aider ? J'ai déjà essayé de débloquer le chien coincé dans le tonneau. J'ai perdu une journée. Explique-toi mieux. 🐕",
        ],
        // Mots-clés émotionnels/simples
        faim: [
            "Tu as faim ? Arrête de penser à ton 'serveur' et mange une bonne soupe aux légumes ! La vraie logique, c'est l'estomac ! 🍲",
            "Moi, j'ai tout le temps faim. Mais ça n'a jamais réglé un problème d'ordinateur. Va faire une sieste. 😴",
        ],
        heure: [
            "Quelle heure il est ? L'heure où il faut nourrir les vaches, ou l'heure où on arrête de parler de travail ? L'heure d'internet, je m'en fiche ! 🕰️",
            "Le soleil est encore là ? Alors c'est pas l'heure de ton truc. ☀️",
        ],
        peche: [
            "La pêche ? Tu parles de mouiller l'hameçon ou de la pêche aux informations sur ton bidule ? Les vrais poissons, c'est plus simple. 🎣",
            "Pêcher, c'est comme coder : tu lances ta ligne et t'attends. Mais au moins, quand tu pêches, t'as pas d'écran. 🐟",
        ],
    }
};

// Fonction pour choisir aléatoirement dans un tableau
const getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Génère une réponse intelligente basée sur les mots-clés de l'utilisateur.
 * @param {string} userMessage Le message saisi par l'utilisateur.
 * @returns {string} Une réponse pertinente et décalée, ou une réponse totalement aléatoire si aucun mot-clé n'est trouvé.
 */
const generateSmartLofoqueResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();
    const { keyword_responses } = PAYSAN_BANK;
    
    // 1. Recherche des mots-clés
    for (const keyword in keyword_responses) {
        if (messageLower.includes(keyword)) {
            // Un mot-clé a été trouvé, utiliser une des réponses associées
            return getRandomElement(keyword_responses[keyword]);
        }
    }
    
    // 2. Si aucun mot-clé n'est trouvé, revenir à la réponse ultra-aléatoire
    return generateMassiveLofoqueResponse();
};

// Fonction principale pour générer une réponse combinatoire ou complète (mode fumier)
const generateMassiveLofoqueResponse = () => {
    const { subjects, comparisons, objects, conclusions, full_sentences } = PAYSAN_BANK;
    
    if (Math.random() < 0.33) {
        // Mode phrase complète
        return getRandomElement(full_sentences);
    } else {
        // Mode combinatoire (avec plus de sujets)
        const subject = getRandomElement(subjects);
        const comparison = getRandomElement(comparisons);
        const object = getRandomElement(objects);
        const conclusion = getRandomElement(conclusions);
        
        return `${subject} ${comparison} ${object}. ${conclusion}`;
    }
};

// --- Composants (inchangés) ---

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

const EmojiPicker = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const popularEmojis = ['🚜', '🐔', '🍺', '🥔', '🐐', '😂', '🤔', '🤷', '🌾', '☀️', '🌧️', '🐷'];

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)} 
                className="p-2 text-yellow-400 hover:bg-gray-700 rounded transition"
                aria-label="Ouvrir le sélecteur d'émojis"
            >
                <Smile size={20} />
            </button>
        );
    }

    return (
        <div className="relative">
            <div className="absolute bottom-12 left-0 bg-gray-800 p-2 rounded-lg shadow-xl border border-gray-700 flex flex-wrap w-56 z-10">
                {popularEmojis.map((emoji, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            onSelect(emoji);
                            setIsOpen(false);
                        }}
                        className="p-1 text-xl hover:bg-gray-600 rounded transition"
                        aria-label={`Sélectionner l'émoji ${emoji}`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-yellow-400 bg-gray-700 hover:bg-gray-600 rounded transition"
                aria-label="Fermer le sélecteur d'émojis"
            >
                <Smile size={20} />
            </button>
        </div>
    );
};


const ChatScreen = ({ userName, setCurrentPage }) => {
    
    // Génération du premier message aléatoire
    const initialAssistantMessage = getRandomElement(PAYSAN_BANK.full_sentences);

    const [chatMessages, setChatMessages] = useState([
        { type: 'system', text: 'Bienvenue au chat !', author: 'Nuit de l\'Apéro', timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) },
        { type: 'assistant', text: initialAssistantMessage, author: 'IA Paysanne', timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    const handleEmojiSelect = (emoji) => {
        setChatInput(prev => prev + emoji);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);


    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;
        
        const userMsg = chatInput;
        
        // 1. Ajout du message utilisateur
        const userMessageId = Date.now();
        setChatMessages(prev => [...prev, { 
            id: userMessageId,
            type: 'user', 
            text: userMsg,
            author: userName, 
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setChatInput('');

        // 2. Affichage du statut "en train d'écrire..." pour l'IA
        const placeholderId = Date.now() + 1;
        setChatMessages(prev => [...prev, {
            id: placeholderId,
            type: 'assistant',
            text: '...', 
            author: 'IA Paysanne',
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            isPlaceholder: true
        }]);
        
        // 3. Génération de la réponse complète (Intelligente ou aléatoire)
        const fullAssistantResponse = generateSmartLofoqueResponse(userMsg);

        // 4. Révélation de la réponse après un court délai
        setTimeout(() => {
            setChatMessages(prev => {
                // Remplacer le placeholder de l'IA par le vrai message
                return prev.map(msg => 
                    msg.id === placeholderId ? 
                    { ...msg, text: fullAssistantResponse, isPlaceholder: false } : 
                    msg
                );
            });
        }, 1200);
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-950">
             <div className="w-full h-full flex flex-col bg-gray-900 rounded-none shadow-2xl overflow-hidden border border-gray-700">
                
                <GnomeTitleBar 
                    title="Chat - IA Paysanne"
                    onClose={() => setCurrentPage('home')}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-900 space-y-4">
                        {chatMessages.map((msg, idx) => {
                            const isUser = msg.type === 'user';
                            const authorColor = isUser ? 'text-blue-400' : msg.type === 'error' ? 'text-red-400' : 'text-green-400';
                            
                            return (
                                <div 
                                    key={idx} 
                                    // Aligné à gauche pour tous les messages
                                    className={`flex flex-col max-w-2xl self-start items-start`}
                                >
                                    
                                    {/* Auteur et Heure */}
                                    <div className={`flex items-center gap-2 mb-1 flex-row`}>
                                        <span className={`font-bold text-sm ${authorColor}`}>{msg.author}</span>
                                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                    </div>
                                    
                                    {/* Bulle de Message */}
                                    <div className={`px-4 py-2 rounded-lg text-sm ${isUser ? 'bg-blue-600 text-white' : msg.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                                        {msg.isPlaceholder ? 
                                            // Statut "en train de réfléchir..."
                                            <span className="animate-pulse italic text-gray-500">
                                                {msg.author} est en train de réfléchir...
                                            </span> 
                                            : 
                                            <span>{msg.text}</span>
                                        }
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="bg-gray-800 p-4 border-t border-gray-700 flex items-center gap-2">
                        
                        {/* 1. Sélecteur d'Emojis */}
                        <EmojiPicker onSelect={handleEmojiSelect} />

                        {/* 2. Champ de Saisie */}
                        <input 
                            type="text" 
                            value={chatInput} 
                            onChange={(e) => setChatInput(e.target.value)} 
                            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()} 
                            placeholder={`Parlez à l'IA Paysanne en tant que ${userName}...`} 
                            className="flex-1 bg-gray-700 outline-none text-white text-sm px-3 py-2 rounded border border-gray-600 placeholder-gray-500" 
                            autoFocus 
                        />
                        
                        {/* 3. Icône de frappe Utilisateur */}
                        <div className={`transition-opacity duration-300 ${chatInput.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
                            <User size={20} className="text-blue-400 animate-pulse" />
                        </div>

                        {/* 4. Bouton Envoyer */}
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