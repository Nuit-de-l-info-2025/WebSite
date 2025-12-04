import React, { useState, useRef, useEffect } from 'react';
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
        "Mon avis sur le marché boursier,",
        "La météo des vacances de la Toussaint,",
    ],
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
        "c'est l'inverse de",
        "se casse aussi facilement que",
    ],
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
        "le pain rassis oublié derrière le poêle. 🍞", 
        "le filet de pêche plein de vieilles chaussettes. 🎣",
        "la roue du vélo qui tourne dans le vide. 🚲",
        "un nuage qui a la forme d'un lapin borgne. ☁️",
        "une vieille boîte de sardines vide et rouillée. 🥫",
        "la confiture de coing qui a collé au fond de la casserole. 🍯",
        "une porte de grange qui grince depuis 10 ans. 🚪",
        "le fantôme du vieux tracteur de mon oncle. 👻",
    ],
    conclusions: [
        "Et puis, l'essentiel, c'est d'avoir de bonnes pommes de terre. 🥔",
        "Moi, je dis qu'il faut en parler au cochon, il comprendra mieux. 🐷",
        "Enfin, je crois. J'ai peut-être bu un coup de trop ce midi. 🍷",
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
        "Je crois que c'est l'heure d'aller chercher le chat. Il est sûrement coincé dans la télé. 📺",
        "Et ça, ça m'énerve autant que les corbeaux qui volent en cercle. C'est pour ça que je change de sujet. 🐦‍⬛",
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
        "La rivière, elle a changé de direction l'hiver dernier. Elle s'est dit 'tiens, pourquoi j'irais là alors que je peux aller là-bas ?'. Maintenant, elle inonde le champ du voisin, et lui il râle. Mais la rivière, elle s'en fout. C'est la même chose avec ton 'réseau'. Il fait ce qu'il veut. Et ma vieille horloge, elle sonne 17 heures à midi, et elle s'arrête à 2h du mat. C'est des trucs de la vie, pas des 'problèmes'. Faut s'habituer au chaos. ⏰",
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

// Logique n°4 : Histoire très longue (Nouveau)
const generateLongStoryResponse = () => {
    return getRandomElement(PAYSAN_BANK.long_stories);
};

// Logique n°2 : Structure qui fait référence à la phrase utilisateur (forme de logique)
const generatePersonalizedResponse = (userMessage) => {
    const { subjects, comparisons, objects, conclusions } = PAYSAN_BANK;
    
    const subject = getRandomElement(subjects);
    const transition = getRandomElement(comparisons);
    const object = getRandomElement(objects);
    const conclusion = getRandomElement(conclusions);
    
    // Fait référence à l'input de l'utilisateur, puis dérive
    // Limite l'extrait à 40 caractères pour ne pas recopier tout le message de l'utilisateur
    return `Tu dis que "${userMessage.substring(0, 40).trim()}${userMessage.length > 40 ? '...' : ''}", mais en vrai, ${subject.toLowerCase()} ${transition} ${object}. ${conclusion}`;
};

// Logique n°3 : Réponse massivement aléatoire (illogique simple)
const generateMassiveLofoqueResponse = () => {
    const { subjects, comparisons, objects, conclusions, full_sentences } = PAYSAN_BANK;
    
    // 33% de chance de retourner une phrase complète et totalement hors de propos
    if (Math.random() < 0.33) {
        return getRandomElement(full_sentences);
    } else {
        // 67% de chance de retourner une réponse structurée à 4 parties
        const subject = getRandomElement(subjects);
        const comparison = getRandomElement(comparisons);
        const object = getRandomElement(objects);
        const conclusion = getRandomElement(conclusions);
        
        return `${subject} ${comparison} ${object}. ${conclusion}`;
    }
};

// LA FONCTION CLÉ : Choisit entre Logique (mots-clés/référence) ou Illogique (Massive Random)
const generateSmartLofoqueResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();
    const { keyword_responses } = PAYSAN_BANK;
    
    // Probabilités de mélange
    const P_KEYWORD = 0.35;    // Réponse liée au mot-clé (Logique n°1)
    const P_LONG_STORY = 0.20; // Nouvelle catégorie très longue (Logique n°4) (Augmenté)
    const P_PERSONALIZED = 0.35; // Réponse structurée (Logique n°2)
    // Reste pour P_MASSIVE = 0.10

    // 1. Vérification des keywords
    for (const keyword in keyword_responses) {
        if (messageLower.includes(keyword)) {
            
            const roll = Math.random();
            
            if (roll < P_KEYWORD) {
                return getRandomElement(keyword_responses[keyword]); // Logique n°1 (35%)
            } else if (roll < P_KEYWORD + P_LONG_STORY) {
                return generateLongStoryResponse(); // Logique n°4 (20%)
            } else if (roll < P_KEYWORD + P_LONG_STORY + P_PERSONALIZED) {
                return generatePersonalizedResponse(userMessage); // Logique n°2 (35%)
            } else {
                return generateMassiveLofoqueResponse(); // Illogique (10%)
            }
        }
    }
    
    // 2. Si AUCUN keyword spécifique n'est trouvé, on privilégie les formes plus longues
    const defaultRoll = Math.random();
    if (defaultRoll < 0.30) { 
        return generateLongStoryResponse(); // 30% d'histoire longue
    } else if (defaultRoll < 0.85) {
        return generatePersonalizedResponse(userMessage); // 55% de réponse structurée
    }
        
    return generateMassiveLofoqueResponse(); // 15% de pure Illogique courte
};

// --- Composant de Barre de Titre ---
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

// --- Composant SÉLECTEUR D'EMOJIS ---
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
    
    // Utilisation d'une salutation spécifique au démarrage
    const initialAssistantMessage = getRandomElement(PAYSAN_BANK.greetings);

    // !!! Changement ici : Retrait du message 'system' de bienvenue !!!
    const [chatMessages, setChatMessages] = useState([
        { type: 'assistant', text: initialAssistantMessage, author: 'IA Paysanne', timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isUserTyping, setIsUserTyping] = useState(false);
    const chatEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

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
        
        // 3. Génération de la réponse complète (via les fonctions intelligentes)
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
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-900 space-y-4 flex flex-col">
                        {chatMessages.map((msg, idx) => {
                            const isUser = msg.type === 'user';
                            const authorColor = isUser ? 'text-blue-400' : msg.type === 'error' ? 'text-red-400' : 'text-green-400';
                            
                            return (
                                <div 
                                    key={idx} 
                                    className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}
                                >
                                    
                                    {/* Auteur et Heure */}
                                    <div className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <span className={`font-bold text-sm ${authorColor}`}>{msg.author}</span>
                                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                    </div>
                                    
                                    {/* Bulle de Message */}
                                    <div className={`px-4 py-2 rounded-lg text-sm max-w-2xl ${isUser ? 'bg-blue-600 text-white' : msg.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                                        {msg.isPlaceholder ? 
                                            // Statut "en train de réfléchir..." avec animation
                                            <span className="flex items-center gap-1 italic text-gray-500">
                                                {msg.author} est en train d'écrire
                                                <span className="flex gap-0.5">
                                                    <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                                                    <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                                                    <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                                                </span>
                                            </span> 
                                            : 
                                            <span>{msg.text}</span>
                                        }
                                    </div>
                                </div>
                            );
                        })}
                        {isUserTyping && (
                            <div className="flex flex-col w-full items-end">
                                <div className="flex items-center gap-2 mb-1 flex-row-reverse">
                                    <span className="font-bold text-sm text-blue-400">{userName}</span>
                                    <span className="text-xs text-gray-500">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white">
                                    <span className="flex items-center gap-1 italic">
                                        {userName} est en train d'écrire
                                        <span className="flex gap-0.5">
                                            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                                            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                                            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="bg-gray-800 p-4 border-t border-gray-700 flex items-center gap-2">
                        
                        {/* 1. Sélecteur d'Emojis */}
                        <EmojiPicker onSelect={handleEmojiSelect} />

                        {/* 2. Champ de Saisie */}
                        <input 
                            type="text" 
                            value={chatInput} 
                            onChange={(e) => {
                                setChatInput(e.target.value);
                                setIsUserTyping(true);
                                
                                // Réinitialiser le timeout si l'utilisateur continue à taper
                                if (typingTimeoutRef.current) {
                                    clearTimeout(typingTimeoutRef.current);
                                }
                                
                                // Arrêter l'animation après 1 seconde d'inactivité
                                typingTimeoutRef.current = setTimeout(() => {
                                    setIsUserTyping(false);
                                }, 1000);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    setIsUserTyping(false);
                                    if (typingTimeoutRef.current) {
                                        clearTimeout(typingTimeoutRef.current);
                                    }
                                    sendChatMessage();
                                }
                            }}
                            placeholder={`Parlez à l'IA Paysanne en tant que ${userName}...`} 
                            className="flex-1 bg-gray-700 outline-none text-white text-sm px-3 py-2 rounded border border-gray-600 placeholder-gray-500" 
                            autoFocus 
                        />
                        
                        {/* 3. Icône de frappe Utilisateur (Animation) */}
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