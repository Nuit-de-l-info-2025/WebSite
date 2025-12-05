const express = require('express');
const cors = require('cors');

// Import de la configuration des pages depuis le fichier 'pages.js' à la racine
const pages = require('../pages'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Commandes prédéfinies (Initialisation des commandes simples)
const commands = {
  help: { 
    output: 'Bienvenue sur le terminal. Taper help, ls, cd [dossier], cat [fichier.txt], man pour le manuel, ou chat.', 
    action: null
  },
  ls: { 
    action: 'ls' // Action gérée par le frontend
  },
  whoami: { 
    output: 'nuit-de-l-apero', 
    action: null
  },
  clear: { 
    action: 'clear' // Action gérée par le frontend
  },
  man: { 
    action: 'man' // Action gérée par le frontend
  },
  chat: { 
    action: 'chat' // Action gérée par le frontend
  },
  mail: { 
    output: 'Mail non implémenté. Utilisez "echo" pour laisser un message.', 
    action: null
  }
};


// Route principale pour l'exécution des commandes
app.post('/api/cmd', (req, res) => {
  const { cmd, currentPage } = req.body;
  
  if (!cmd) {
    return res.json({ output: '' });
  }

  // Gestion de 'cd'
  if (cmd.startsWith('cd ')) {
    const targetPage = cmd.substring(3).trim();

    // Revenir en arrière
    if (targetPage === '..') {
        const parentPageKey = Object.keys(pages).find(key => 
            Object.values(pages).some(page => 
                page.commands && page.commands.includes(`cd ${currentPage}`)
            )
        );
        const parent = parentPageKey || 'home'; 

        return res.json({
            output: `cd: Changement vers ${parent}`,
            action: 'cd',
            payload: parent
        });
    }

    // Aller vers une nouvelle page
    if (pages[targetPage]) {
      return res.json({
        output: `cd: Changement vers ${targetPage}`,
        action: 'cd',
        payload: targetPage
      });
    }
    
    return res.json({
      output: `bash: cd: ${targetPage}: Aucun fichier ou dossier de ce type`
    });
  }
  
  // Gestion de 'cat'
  if (cmd.startsWith('cat ')) {
    const file = cmd.substring(4).trim();
    const pageName = file.replace('.txt', '');
    const page = pages[pageName];
    
    if (page) {
      // Utilisation de la description de la page comme contenu du fichier
      return res.json({
        output: `=== ${page.title} ===\n${page.description}`
      });
    }
    
    return res.json({
      output: `cat: ${file}: Aucun fichier ou dossier de ce type`
    });
  }
  
  // Gestion des commandes prédéfinies
  if (commands[cmd]) {
    const response = commands[cmd];
    return res.json({
      output: response.output || '',
      action: response.action || null
    });
  }
  
  // Gestion de 'echo'
  if (cmd.startsWith('echo ')) {
    const text = cmd.substring(5).trim().replace(/\"/g, '');
    return res.json({
      output: text
    });
  }
  
  // Commande inconnue
  res.json({
    output: `bash: ${cmd}: commande non trouvée`
  });
});

// Route suggestions (pour l'autocomplétion)
app.get('/api/suggestions/:currentPage', (req, res) => {
  const page = pages[req.params.currentPage];
  
  if (!page) {
    return res.json({ commands: [] }); 
  }
  
  res.json({ commands: page.commands });
});


// --- EXPORT POUR VERCEL ---
// Ceci remplace app.listen() et permet à Vercel d'exécuter l'application Express
module.exports = app;