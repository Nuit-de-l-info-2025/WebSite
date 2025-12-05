// pages.js - Configuration des pages

const pages = {
  home: {
    name: 'home',
    title: 'Accueil',
    description: 'Page d\'accueil de notre équipe Nuit de l\'Info',
    commands: ['help', 'ls', 'cat about.txt', 'cd portfolio', 'cd projets', 'cd equipe', 'cd contact']
  },
  portfolio: {
    name: 'portfolio',
    title: 'Portfolio',
    description: 'Nos réalisations et projets',
    commands: ['ls', 'cat portfolio.txt', 'cd projets', 'cd ..']
  },
  about: {
    name: 'about',
    title: 'À propos',
    description: 'Informations sur notre équipe',
    commands: ['whoami', 'cat team.txt', 'cd equipe', 'cd ..']
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
    commands: ['ls', 'cat projets.txt', 'cat project1.txt', 'cat project2.txt', 'cd ..']
  },
  equipe: {
    name: 'equipe',
    title: 'Équipe',
    description: 'Informations sur l\'équipe complète',
    commands: ['whoami', 'cat equipe.txt', 'cat membres.txt', 'cd ..']
  }
};

module.exports = pages;