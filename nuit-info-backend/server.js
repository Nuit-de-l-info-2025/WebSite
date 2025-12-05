const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Pages disponibles
const pages = {
  home: {
    name: 'home',
    title: 'Accueil',
    description: 'Page d\'accueil de notre équipe Nuit de l\'Info',
    commands: ['help', 'ls', 'cat about.txt', 'cd about', 'cd projets', 'cd equipe', 'cd contact', 'cd chat']
  },
  about: {
    name: 'about',
    title: 'À propos',
    description: 'Informations sur notre équipe',
    commands: ['whoami', 'cat about.txt', 'cd equipe', 'cd ..']
  },
  contact: {
    name: 'contact',
    title: 'Contact',
    description: 'Nous contacter',
    commands: ['echo "Message"', 'mail', 'cd chat', 'cd ..']
  },
  chat: {
    name: 'chat',
    title: 'Chat',
    description: 'Chat en direct avec l\'équipe',
    commands: ['help', 'cd ..']
  },
  projets: {
    name: 'projets',
    title: 'Projets',
    description: 'Tous nos projets détaillés',
    commands: ['ls', 'cat projets.txt', 'cd ..']
  },
  equipe: {
    name: 'equipe',
    title: 'Équipe',
    description: 'Informations sur l\'équipe complète',
    commands: ['whoami', 'cat equipe.txt', 'cd ..']
  }
};

// Commandes disponibles
const commands = {
  help: {
    output: `Commandes disponibles:\n  ls        - Lister les répertoires\n  cd        - Changer de répertoire\n  cat       - Afficher le contenu\n  whoami    - Infos équipe\n  help      - Afficher cette aide`
  },
  ls: {
    output: `about/\nprojets/\nequipe/\ncontact/\nchat/\nREADME.txt`
  },
  whoami: {
    output: `Équipe Nuit de l'Info 2025\nDevs passionnés | Innovation | Créativité`
  },
  clear: {
    output: '',
    action: 'clear'
  }
};

// Route pages
app.get('/api/pages', (req, res) => {
  res.json({
    pages: Object.keys(pages),
    current: 'home'
  });
});

// Route page info
app.get('/api/pages/:pageName', (req, res) => {
  const page = pages[req.params.pageName];
  if (!page) {
    return res.status(404).json({ error: 'Page non trouvée' });
  }
  res.json(page);
});

// Route commandes
app.post('/api/command', (req, res) => {
  const { command, currentPage } = req.body;
  const cmd = command.trim().toLowerCase();
  
  // Commandes cd
  if (cmd.startsWith('cd ')) {
    const target = cmd.substring(3).trim();
    
    if (target === '..') {
      return res.json({
        output: 'Retour à l\'accueil',
        nextPage: 'home',
        action: 'navigate'
      });
    }
    
    if (pages[target]) {
      return res.json({
        output: `Changement vers ${pages[target].title}`,
        nextPage: target,
        action: 'navigate'
      });
    }
    
    return res.json({
      output: `bash: cd: ${target}: Aucun fichier ou dossier de ce type`
    });
  }
  
  // Commandes cat
  if (cmd.startsWith('cat ')) {
    const file = cmd.substring(4).trim();
    const pageName = file.replace('.txt', '');
    const page = pages[pageName];
    
    if (page) {
      return res.json({
        output: `=== ${page.title} ===\n${page.description}`
      });
    }
    
    return res.json({
      output: `cat: ${file}: Aucun fichier ou dossier de ce type`
    });
  }
  
  // Commandes prédéfinies
  if (commands[cmd]) {
    const response = commands[cmd];
    return res.json({
      output: response.output || '',
      action: response.action || null
    });
  }
  
  // Echo
  if (cmd.startsWith('echo ')) {
    const text = cmd.substring(5).trim().replace(/"/g, '');
    return res.json({
      output: text
    });
  }
  
  // Commande inconnue
  res.json({
    output: `bash: ${cmd}: commande non trouvée`
  });
});

// Route suggestions
app.get('/api/suggestions/:currentPage', (req, res) => {
  const page = pages[req.params.currentPage];
  
  if (!page) {
    return res.status(404).json({ error: 'Page non trouvée' });
  }
  
  res.json({
    commands: page.commands,
    page: req.params.currentPage
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend en ligne', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Nuit de l'Info lancé sur http://localhost:${PORT}`);
  console.log(`📄 Pages disponibles: ${Object.keys(pages).join(', ')}`);
});