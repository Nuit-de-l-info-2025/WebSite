import React, { useState, useRef, useEffect, useCallback } from 'react'; 
import { X, Send, Smile, User } from 'lucide-react'; 

// --- BASE DE DONNÉES MASSIVE (PAYSAN_BANK) ---
const PAYSAN_BANK = {
    subjects: [
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
        "Le moulin à vent du grand-père,",
        "La vieille radio dans la grange,",
        "L'odeur du purin frais,",
    ],
    comparisons: [
        "a la même utilité que",
        "est aussi embrouillé que",
        "ressemble étrangement à",
        "me fait penser au",
        "sent mauvais, un peu comme", 
        "est aussi logique que",
        "est l'équivalent de",
    ],
    objects: [
        "le foin quand il est mouillé après la grêle. ⛈️",
        "le chemin de la ferme après trois jours de pluie diluvienne. 🌧️",
        "une poule qui essaie d'apprendre l'allemand à la radio. 🐔",
        "une cuillère en bois dans une botte de paille oubliée. 🌾",
        "un troupeau de vaches qui court après une mouche. 🐄", 
        "le bruit que fait ma tondeuse quand elle avale une pierre. 💥",
        "un fromage de chèvre oublié derrière le radiateur. 🧀",
    ],
    conclusions: [
        "Et puis, l'essentiel, c'est d'avoir de bonnes pommes de terre. 🥔",
        "Moi, je dis qu'il faut en parler au cochon, il comprendra mieux. 🐷",
        "Enfin, je crois. J'ai peut-être bu un coup de trop ce midi. 🍷",
        "Alors, on ferait mieux d'aller voir si les œufs sont frais, hein. 🍳", 
        "Laissons ça aux citadins, nous, on a le champ à faire. 🧑‍🌾", 
        "Tant que le vin est bon, le reste, on s'en fout. 🍷",
        "Mais bon, le tout, c'est de pas se faire piquer par les guêpes. 🐝",
    ],
    full_sentences: [
        "J'ai pas le temps, j'ai les salades qui attendent au jardin. On reparle de tout ça après la récolte. 🥬",
        "Je suis désolé mon gars, mais j'étais en train de caresser les vaches. J'ai pas bien écouté. C'était quoi déjà la question ? 🐄",
        "Tout ça, c'est bien beau, mais c'est quand qu'on mange ? Moi, quand je réfléchis trop, j'ai faim. 🥖",
        "Tu devrais éteindre et rallumer. Si ça marche pas, change le pneu de la charrette. C'est la seule solution que je connais. 🔧",
        "Si ça continue, je débranche tout et je prends ma retraite dans un poulailler. Au moins, là, je sais qui je suis. 🏡",
        "La dernière fois qu'on m'a parlé de 'serveur', c'était le serveur de bière à la fête du village. Et il était bon, lui ! 🍻",
        "J'ai vu un avion voler à l'envers, ça doit être pour ça que ton ordinateur fait des siennes. Faut demander aux oiseaux ! 🐦",
        "Mon grand-père disait : quand tu as un doute, bois un petit coup. C'est la meilleure réponse à tout. 🥃",
        "Dis donc, ça sent le cramé ici, ou c'est juste ton truc d'ordinateur ? 💨",
        "Les oies sont en train de marcher en ligne droite. Ça, c'est un signe. Fais comme elles. 🦢",
        "Le fait est que mon chat dort sur le clavier. On en reparle après sa sieste. 🐈‍⬛",
        "J'ai la tête qui tourne, tu devrais t'asseoir. Non, ne me demande plus rien, je cherche mes lunettes. 👓",
        "Le voisin m'a dit que son râteau faisait de l'électricité statique. C'est sûrement le même problème que toi. Achète un râteau. 🧲",
    ],
    // NOUVEAU : Histoires longues et très décalées
    long_stories: [ 
        "J'ai passé la semaine dernière à essayer d'apprendre à mon cochon à faire des équations, tu vois ? Il a fait des progrès sur les additions mais dès qu'on touche à la soustraction, il se met à grogner et il va manger le pied de la table. C'est comme ton problème d'ordinateur : tu crois que tu vas avancer, mais le résultat est toujours moins bon que ce que t'espérais au départ. Et en plus, ça sent le soufre. Fais gaffe à pas t'électrocuter avec l'antenne râteau, c'est ce qui est arrivé au facteur l'année du grand gel. 🥶",
        "Tu sais, y'a une vieille légende ici, comme quoi les fourmis, quand elles traversent le chemin en ligne, elles prévoient la récolte de l'année. Sauf que les fourmis d'aujourd'hui, elles sont toutes déréglées par les ondes du téléphone, et elles se mettent à marcher en cercle. Du coup, ça fait trois ans qu'on a que des radis et des betteraves tordues. Ton histoire, c'est un peu pareil, ça tourne en rond parce que les bases sont fausses, comme les fourmis sous 4G. T'auras beau cliquer, ça restera des radis tordus. 🐜",
        "Le secret, c'est le fumier. Mais pas n'importe lequel. Il faut celui de la chèvre qui a mangé les journaux politiques du matin. Ça donne une terre fertile et des idées complètement tordues. Si t'appliquais ça à ton 'serveur', peut-être qu'il donnerait quelque chose d'utile, comme une tarte aux quetsches. Mais comme t'as pas de chèvre, et pas de quetsches, et pas de serveur à la ferme, eh bien, tu restes coincé. C'est la vie. Bois un coup, ça passera. 🥃",
        "Il y a une histoire du côté de la mare, une histoire de grenouille qui avait avalé une clé de 12. Chaque fois qu'elle coassait, ça faisait un bruit de cliquetis métallique, et on savait jamais si elle demandait à manger ou si elle essayait de réparer la pompe à eau. Ton problème, il a l'air d'être dans le même genre : un bruit bizarre, pas de solution, et probablement de la rouille dedans. Il faudrait lui donner une bonne baffe, à ton ordinateur, comme on fait avec le moteur quand il veut pas démarrer au petit matin. 🐸",
        "L'autre jour, j'ai vu ma brouette rouler toute seule, en pleine nuit. J'ai d'abord pensé au vent, mais non, elle zigzagait ! Ma femme m'a dit que c'était la pleine lune, mais moi je pense que c'est à cause de ces nouvelles réglementations européennes sur le compost. C'est pareil avec ton ordinateur : c'est pas le logiciel qui déconne, c'est l'administration qui est passée par là. Essaie de remplir le formulaire cerfa 1245-B pour voir si ça débloque la souris. 📄",
        "Les patates. C'est la seule chose qui a une vraie logique ici. Tu les plantes, ça pousse, tu les manges. Mais ton truc d'internet, c'est comme le vieux disjoncteur dans le hangar : il saute dès que le chat éternue. On change le fusible, mais il saute quand même, et le chat n'a rien à voir là-dedans. Alors on laisse tout éteint. C'est peut-être la solution pour toi aussi : laisse tout éteint et va te coucher. C'est l'heure de la soupe. 🍲",
        "J'ai un épouvantail, tu vois. Je l'ai mis dans le champ. Au début, il effrayait les corbeaux. Maintenant, il est tellement bien habillé et bien planté qu'il a été promu 'chef de parcelle' par les moineaux. C'est ça le vrai bug. Quand tu essayes d'avoir un outil, et qu'il devient plus important que toi. Ton 'système' là, il est devenu chef de parcelle, tu peux plus rien lui demander. Fallait le laisser en paille, tout simple. 🌾",
        "La rivière, elle a changé de direction l'hiver dernier. Elle s'est dit 'tiens, pourquoi j'irais là alors que je peux aller là-bas ?'. Maintenant, elle inonde le champ du voisin, et lui il râle. Mais la rivière, elle s'en fout. C'est la même chose avec ton 'réseau'. Il fait ce qu'il veut. Et ma vieille horloge, elle sonne 17 heures à midi, et elle s'arrête à 2h du mat. C'est des trucs de la vie, pas des 'problèmes'. Faut t'habituer au chaos. ⏰",
        "Mon vieux coq, il chante plus 'cocorico'. Maintenant, il ne chante qu'en binaire. 'Un, zéro, zéro, un, un'. Il a mangé une puce électronique, je crois. Du coup, toutes les poules sont perdues. Elles pondent des œufs carrés. C'est la faute de l'évolution forcée. Ton 'logiciel', c'est ça aussi : un coq qui chante en binaire. Faut lui donner du maïs, pas du code. Mais bon, si t'es là pour de la logique, t'as frappé à la mauvaise porte de l'univers. 🐔🥚",
        "Je me souviens d'une fois où j'ai essayé de réparer ma clôture avec de la ficelle de boudin. Le boudin était périmé, la ficelle a lâché, et les vaches se sont enfuies vers le centre-ville. C'est l'effet 'solution rapide' ! C'est ce que tu cherches avec ton bidule. Fais pas de la ficelle de boudin avec ton code, tu vas te retrouver avec des vaches dans la mairie. Prends une vraie corde, ou va traire une chèvre. Ça, c'est concret. 🐄",
        "Il y a un champ de maïs, juste derrière. On l'a semé trop tard. Du coup, les épis n'arrivent pas à maturité et ils se parlent entre eux avec des messages d'erreur. C'est un peu comme si ton application faisait des 'conversations maïs' inutiles. Faut couper la tête de l'épi, ça coupe la conversation. Moi, j'ai tout coupé, et j'ai mis des choux à la place. Les choux, eux, ils se taisent et ils deviennent de la soupe. C'est plus sain pour l'esprit. 🌽🥬",
        "J'ai perdu ma casquette dans le puits. J'ai jeté une pierre pour la faire remonter. Mais la pierre était trop grosse et elle a cassé la pompe. Maintenant, j'ai plus d'eau pour les tomates, et la casquette est toujours au fond. C'est la loi de l'emmerdement maximum. Ton 'optimisation', c'est la pierre que tu jettes pour récupérer ta casquette. Tu résous un truc pour en casser deux. Et je parie que ta casquette, elle était moche de toute façon. Faut accepter de la perdre. 🧢",
    ],
    greetings: [ // Pour le premier message uniquement
        "Alors, te v'là ! Qu'est-ce que tu cherches dans mon patelin numérique ? T'as l'air d'un citadin perdu, hé !",
        "Salut l'ami ! Fais gaffe où tu cliques, y'a une araignée qui a fait son nid dans le serveur. C'est l'IA Paysanne, enchanté. Ou pas.",
        "Hé ! On m'a dit que t'étais là. Faut que je te prévienne : ici, les vaches ont les pleins pouvoirs. Commence la causette, si t'es pas trop occupé !",
        "Tiens, une nouvelle tête ! Installe-toi. Mais attention, les chaises sont en paille et y'a un chat qui dort dessus. Qu'est-ce que tu racontes de beau ?",
        "Bonjour ! Le temps est au beau fixe pour les légumes. Alors, dis-moi ce qui t'amène à la ferme du code !",
    ],
    keyword_responses: {
        code: [
            "Le code ? Ça, c'est le truc que j'ai mis sur le portail pour que les chèvres n'ouvrent pas. Le tien doit être aussi solide. 🐐",
            "Ton 'code' est cassé ? Essaie de le taper plus fort sur la table, des fois ça marche avec le tracteur. 🚜",
            "J'ai appris le 'code de la route' en 1978. Si ça t'aide, je peux t'expliquer le panneau 'Danger vaches'. ⚠️",
            "Le code, c'est comme le dosage du cidre : un peu de trop et ça devient imbuvable. Fais gaffe à la fermentation. 🍏",
        ],
        bug: [
            "Un bug ? C'est sûrement le hanneton qui est entré dans la prise. Mets un coup de balai, ça règlera le problème. 🧹",
            "Les bugs, nous, on les donne aux poules. Ça, c'est de la logique paysanne ! 🐔",
            "Si t'as un bug, ça veut dire que le logiciel, c'est comme une laitue avec une limace dedans. Faut la jeter ! 🥬",
            "Ça doit être une taupe virtuelle qui ronge les câbles. Faut lui mettre un piège à souris dans la tour, ça marche. 🐭",
        ],
        internet: [
            "Internet ? Ça, c'est le grand tuyau invisible par où passent les potins de village. Et ça rame comme mon voisin quand il a bu trop de cidre. 🍺",
            "Pour avoir internet, faut monter sur le toit de la grange. Et même là, faut pas pleuvoir. 🌧️",
            "Je préfère encore parler au pigeon voyageur. Lui au moins, il est fiable. 🐦",
            "Internet, ça rend sourd et ça rend bête. Viens sentir les fleurs, ça te fera du bien. 🌻",
        ],
        argent: [
            "L'argent ? C'est ce qui manque toujours quand le prix du blé baisse. Ton problème est plus facile à régler, c'est sûr. 💰",
            "L'argent pousse pas dans les champs, mon gars. Laisse tomber ton ordinateur et viens labourer un peu. 🌾",
            "Si ça coûte cher, ça ne sert à rien. Règle universelle de la ferme. 🤷",
            "L'argent, c'est le mal. Un bon jambon, c'est mieux. Tu peux le manger, lui. 🍖",
        ],
        aide: [
            "De l'aide ? Tu cherches l'aiguille dans la botte de foin. Moi, je te propose un bon apéro, c'est plus efficace. 🍷",
            "T'aider ? J'ai déjà essayé de débloquer le chien coincé dans le tonneau. J'ai perdu une journée. Explique-toi mieux. 🐕",
            "L'aide, ça n'existe pas. Il n'y a que le travail, et la patience du tracteur. 🚜",
        ],
        problème: [
            "Un problème ? J'ai un problème avec la buse d'arrosage qui pisse de travers. Ça, c'est un vrai problème. Le tien, c'est de la gaminerie. 💧",
            "Les problèmes sont faits pour rester des problèmes. Sinon, on n'aurait plus rien à raconter à la fête du village. Laisse-le vivre. 🥳",
            "Ton problème, c'est un moustique dans une flaque d'huile. Ça va mourir tout seul si tu attends un peu. 🦟",
        ],
        ordinateur: [
            "Ton ordinateur ? C'est comme un âne têtu. Faut le laisser brouter et il se calmera tout seul. 🐴",
            "L'ordinateur, c'est une boîte à mensonges. Moi, je préfère ma vieille machine à écrire. Au moins, quand elle se bloque, je peux la frapper. ⌨️",
        ]
    }
};

// --- FONCTIONS IA ALÉATOIRE ET DE RÉCUPÉRATION ---
const getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
const generateLongStoryResponse = () => {
    return getRandomElement(PAYSAN_BANK.long_stories);
};

const generatePersonalizedResponse = (userMessage) => {
    const { subjects, comparisons, objects, conclusions } = PAYSAN_BANK;
    
    const subject = getRandomElement(subjects);
    const transition = getRandomElement(comparisons);
    const object = getRandomElement(objects);
    const conclusion = getRandomElement(conclusions);
    
    return `Tu dis que "${userMessage.substring(0, 40).trim()}${userMessage.length > 40 ? '...' : ''}", mais en vrai, ${subject.toLowerCase()} ${transition} ${object}. ${conclusion}`;
};

const generateMassiveLofoqueResponse = () => {
    const { subjects, comparisons, objects, conclusions, full_sentences } = PAYSAN_BANK;
    
    if (Math.random() < 0.33) {
        return getRandomElement(full_sentences);
    } else {
        const subject = getRandomElement(subjects);
        const comparison = getRandomElement(comparisons);
        const object = getRandomElement(objects);
        const conclusion = getRandomElement(conclusions);
        
        return `${subject} ${comparison} ${object}. ${conclusion}`;
    }
};

const generateSmartLofoqueResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();
    const { keyword_responses } = PAYSAN_BANK;
    
    const P_KEYWORD = 0.35;     
    
    for (const keyword in keyword_responses) {
        if (messageLower.includes(keyword)) {
            if (Math.random() < P_KEYWORD) {
                const responses = keyword_responses[keyword];
                return getRandomElement(responses);
            }
        }
    }

    const defaultRoll = Math.random();
    if (defaultRoll < 0.30) {
        return generateLongStoryResponse(); 
    } else if (defaultRoll < 0.85) {
        return generatePersonalizedResponse(userMessage); 
    }
    
    return generateMassiveLofoqueResponse();
};

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

// Composant de Poignée de Redimensionnement (NOUVEAU)
const ResizeHandle = ({ direction, onMouseDown }) => {
    const cursorMap = {
        'r': 'ew-resize', 'l': 'ew-resize',
        't': 'ns-resize', 'b': 'ns-resize',
        'rt': 'nesw-resize', 'rb': 'nwse-resize',
        'lt': 'nwse-resize', 'lb': 'nesw-resize'
    };

    const positionMap = {
        't': 'top-0 left-0 w-full h-1 cursor-ns-resize',
        'b': 'bottom-0 left-0 w-full h-1 cursor-ns-resize',
        'l': 'top-0 left-0 h-full w-1 cursor-ew-resize',
        'r': 'top-0 right-0 h-full w-1 cursor-ew-resize',
        'lt': 'top-0 left-0 w-2 h-2 cursor-nwse-resize',
        'rt': 'top-0 right-0 w-2 h-2 cursor-nesw-resize',
        'lb': 'bottom-0 left-0 w-2 h-2 cursor-nesw-resize',
        'rb': 'bottom-0 right-0 w-2 h-2 cursor-nwse-resize',
    };

    return (
        <div
            className={`absolute z-[101] ${positionMap[direction]}`}
            style={{ cursor: cursorMap[direction] }}
            onMouseDown={(e) => onMouseDown(e, direction)}
        />
    );
};


const MessageBubble = ({ msg, userName }) => {
    const isUser = msg.type === 'user';
    const authorColor = isUser ? 'text-blue-400' : 'text-yellow-400';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full md:max-w-3/4`}>
                
                {/* Auteur et Heure */}
                <div className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className={`font-bold text-sm ${authorColor}`}>{msg.author}</span>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
                
                {/* Contenu du Message */}
                <div className={`px-4 py-2 rounded-lg max-w-2xl text-sm ${msg.type === 'user' ? 'bg-blue-600 text-white ml-auto' : msg.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                    {msg.text}
                </div>
            </div>
        </div>
    );
};

const EmojiPicker = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popularEmojis = ['😀', '👍', '👎', '💡', '🤔', '🤣', '😭', '🐐', '🐄', '🚜', '🌾', '🥔', '🔨', '🐛', '💻', '💰']; 

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition"
                aria-expanded={isOpen}
                aria-controls="emoji-panel"
            >
                <Smile size={18} />
            </button>
            {isOpen && (
                <div id="emoji-panel" className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 rounded-lg shadow-xl grid grid-cols-4 gap-1 w-56 z-10">
                    {popularEmojis.map((emoji, index) => (
                        <button 
                            key={index}
                            onClick={() => {
                                onSelect(emoji);
                                setIsOpen(false);
                            }}
                            className="p-1 text-xl hover:bg-gray-600 rounded transition"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


const ChatScreen = ({ userName, showChat, setShowChat }) => {
    
    // --- États Spécifiques au Chat ---
    const [chatMessages, setChatMessages] = useState([{
        id: Date.now(), 
        type: 'bot', 
        text: getRandomElement(PAYSAN_BANK.greetings), 
        author: 'IA Paysanne 🐄', 
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }]);
    const [chatInput, setChatInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const chatEndRef = useRef(null);
    
    // --- États de Position et de Redimensionnement (MODIFIÉ) ---
    const windowRef = useRef(null);
    const minWidth = 400;
    const minHeight = 400;

    const [position, setPosition] = useState({ 
        x: window.innerWidth * 0.1 + 60, 
        y: window.innerHeight * 0.1 + 60 
    }); 
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // NOUVEAUX ÉTATS POUR LA REDIMENSION
    const [dimensions, setDimensions] = useState({
        width: Math.max(minWidth, window.innerWidth * 0.6),
        height: Math.max(minHeight, window.innerHeight * 0.7)
    });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState('');


    // --- LOGIQUE DE DRAG ---
    const handleMouseDown = useCallback((e) => {
        if (e.button !== 0 || !windowRef.current) return; 

        const windowRect = windowRef.current.getBoundingClientRect();
        
        setOffset({
            x: e.clientX - windowRect.left,
            y: e.clientY - windowRect.top,
        });
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !windowRef.current) return;
        
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;

        // Limite de déplacement pour rester dans la vue
        newX = Math.max(0, Math.min(newX, window.innerWidth - windowRef.current.clientWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - windowRef.current.clientHeight));

        setPosition({ x: newX, y: newY });
    }, [isDragging, offset]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false); // S'assurer que le redimensionnement s'arrête aussi
    }, []);

    // --- LOGIQUE DE REDIMENSIONNEMENT (AJOUTÉ) ---
    const handleResizeMouseDown = useCallback((e, direction) => {
        e.stopPropagation(); // Empêche le drag de démarrer en même temps
        setIsResizing(true);
        setResizeDirection(direction);
    }, []);

    const handleResizeMouseMove = useCallback((e) => {
        if (!isResizing || !windowRef.current) return;

        const currentWindow = windowRef.current.getBoundingClientRect();
        let newWidth = currentWindow.width;
        let newHeight = currentWindow.height;
        let newX = position.x;
        let newY = position.y;

        // Logique de redimensionnement (selon la direction)
        if (resizeDirection.includes('r')) {
            newWidth = Math.max(minWidth, e.clientX - currentWindow.left);
        }
        if (resizeDirection.includes('b')) {
            newHeight = Math.max(minHeight, e.clientY - currentWindow.top);
        }
        if (resizeDirection.includes('l')) {
            const diff = currentWindow.right - e.clientX;
            newWidth = Math.max(minWidth, diff);
            // Si la nouvelle largeur est valide, on change la position X
            if (diff >= minWidth) {
                newX = e.clientX;
            }
        }
        if (resizeDirection.includes('t')) {
            const diff = currentWindow.bottom - e.clientY;
            newHeight = Math.max(minHeight, diff);
            // Si la nouvelle hauteur est valide, on change la position Y
            if (diff >= minHeight) {
                newY = e.clientY;
            }
        }

        setDimensions({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });

    }, [isResizing, resizeDirection, position, minWidth, minHeight]);


    // Gérer les événements globaux
    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', isResizing ? handleResizeMouseMove : handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleResizeMouseMove);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleResizeMouseMove);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp, handleResizeMouseMove]);


    // Effet pour l'auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);
    
    // Gérer l'état de l'utilisateur qui tape
    useEffect(() => {
        if (chatInput.length > 0) {
            setIsUserTyping(true);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                setIsUserTyping(false);
            }, 1000); 
        } else {
            setIsUserTyping(false);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    }, [chatInput]);

    const handleEmojiSelect = (emoji) => {
        setChatInput(prev => prev + emoji);
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');

        // 1. Ajout du message utilisateur
        const userMessageId = Date.now();
        setChatMessages(prev => [...prev, {
            id: userMessageId,
            type: 'user',
            text: userMsg,
            author: userName,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }]);

        // 2. Réponse du Bot après un délai
        setIsBotTyping(true);

        setTimeout(() => {
            const botResponse = generateSmartLofoqueResponse(userMsg);
            
            setIsBotTyping(false);
            setChatMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: botResponse,
                author: 'IA Paysanne 🐄',
                timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1200);
    };

    if (!showChat) return null;

    return (
        <div 
            ref={windowRef} 
            className="fixed z-[100] flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700 transition-shadow duration-300"
            style={{ 
                top: `${position.y}px`, 
                left: `${position.x}px`,
                // UTILISATION DES ÉTATS DE REDIMENSIONNEMENT
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                maxWidth: '98vw', 
                maxHeight: '98vh',
                minWidth: `${minWidth}px`,
                minHeight: `${minHeight}px`,
            }}
        >
            {/* AJOUT DES POIGNÉES DE REDIMENSIONNEMENT */}
            <ResizeHandle direction="rb" onMouseDown={handleResizeMouseDown} />
            <ResizeHandle direction="lb" onMouseDown={handleResizeMouseDown} />
            <ResizeHandle direction="rt" onMouseDown={handleResizeMouseDown} />
            <ResizeHandle direction="lt" onMouseDown={handleResizeMouseDown} />
            <ResizeHandle direction="r" onMouseDown={handleResizeMouseDown} />
            <ResizeHandle direction="l" onMouseDown={handleResizeMouseDown} />
            <ResizeHandle direction="t" onMouseDown={handleResizeMouseDown} />
            <ResizeHandle direction="b" onMouseDown={handleResizeMouseDown} />

            <GnomeTitleBar 
                title="Chat - IA Paysanne" 
                onClose={() => setShowChat(false)} 
                onMouseDown={handleMouseDown} 
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* 1. Zone de Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
                    {chatMessages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} userName={userName} />
                    ))}
                    <div ref={chatEndRef} />
                    
                    {/* Indicateur de frappe du bot */}
                    {isBotTyping && (
                        <div className="flex items-center gap-2 mb-1 flex-row">
                             <div className="w-8 h-8 rounded-full bg-yellow-700 flex items-center justify-center flex-shrink-0">
                                 <User size={18} className="text-yellow-200" />
                            </div>
                            <div className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-100">
                                <span className="flex gap-0.5">
                                    <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                                    <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                                    <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Indicateur de frappe de l'utilisateur */}
                {isUserTyping && (
                    <div className="w-full bg-gray-950 p-1 flex justify-end">
                        <span className="text-xs text-gray-500 italic flex items-center gap-1">
                            {userName} est en train d'écrire
                            <span className="flex gap-0.5">
                                <span className="w-1 h-1 bg-gray-500 rounded-full animate-ping" style={{animationDelay: '0ms'}}></span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full animate-ping" style={{animationDelay: '150ms'}}></span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full animate-ping" style={{animationDelay: '300ms'}}></span>
                            </span>
                        </span>
                    </div>
                )}


                {/* 3. Champ de Saisie */}
                <div className="bg-gray-800 p-4 border-t border-gray-700 flex items-center gap-2">
                    <EmojiPicker onSelect={handleEmojiSelect} />
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
    );
};

export default ChatScreen;