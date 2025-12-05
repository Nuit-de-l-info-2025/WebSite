# README du Projet : Simulation de Bureau Ubuntu

## 📝 Introduction

Ce projet est une application web construite avec **React/Vite** qui simule l'interface d'un bureau **Ubuntu 22.04 LTS**. L'application propose un terminal interactif, un système de fenêtres flottantes (modales) déplaçables, des applications intégrées (mini-jeux) et un chatbot au caractère excentrique.

L'objectif principal est de fournir une expérience interactive en ligne de commande tout en intégrant des fonctionnalités modernes dans un environnement nostalgique.

## 🚀 Fonctionnalités Clés

### 1. Terminal Interactif et Gestion des Utilisateurs (`Terminal.jsx`, `App.jsx`)

Le composant `Terminal.jsx` simule une console GNOME redimensionnable et gère toutes les interactions utilisateur. Il prend en charge deux niveaux d'accès : l'utilisateur standard (`nuit-de-l-apero`) et le super-utilisateur (`root`).

#### Commandes Disponibles

| Commande | Description | Accès |
| :--- | :--- | :--- |
| `help` / `man` | Ouvre le **Manuel d'utilisation** (fenêtre modale `Manual.jsx`). | Tous |
| `ls` | Liste les répertoires et fichiers accessibles. | Tous |
| `cd [dossier]` | Permet de naviguer dans la structure de répertoires simulée. | Tous |
| `cat [fichier]` | Affiche le contenu des fichiers texte disponibles. | Tous |
| `whoami` | Affiche le nom de l'utilisateur actif. | Tous |
| `su root` | **Change d'utilisateur pour passer en mode Super-utilisateur (`root`).** | Tous |
| `exit` | Quitte la session `root` pour revenir à l'utilisateur standard. | `root` uniquement |
| `clear` | Nettoie l'historique de la console. | Tous |
| `echo [message]` | Répète le message tapé. | Tous |
| `close` | Ferme la dernière fenêtre modale flottante ouverte. | Tous |
| `chat` | Ouvre la fenêtre du **Chatbot "IA Paysanne"** (`ChatScreen.jsx`). | Tous |
| `snake` | Lance le **Jeu du Serpent** (`SnakeGameScreen.jsx`). | `root` uniquement |
| `pixel` | Lance le **Jeu Pixel** (`PixelgameScreen.jsx`). | Tous |
| `index` | Lance l'application **Index** (`IndexScreen.jsx`). | Tous |

---

### 2. Chatbot "IA Paysanne" (`ChatScreen.jsx`) 🐄

Cette modale flottante permet d'interagir avec une intelligence artificielle dotée d'une personnalité humoristique et rurale.

* **Logique de Réponse :** L'IA génère des réponses basées sur une vaste base de données interne (`PAYSAN_BANK`) d'analogies, de comparaisons et d'histoires à thème paysan.
* **Expérience :** Intègre un indicateur de saisie ("en train de taper...") pour simuler une conversation.
* **Fonctionnalité :** La fenêtre est entièrement déplaçable.

---

### 3. Mini-Jeux et Applications (`IndexScreen.jsx`, `SnakeGameScreen.jsx`, `PixelgameScreen.jsx`)

Ces fonctionnalités sont encapsulées dans des fenêtres modales flottantes et utilisent des `iframe` pour afficher des contenus externes (jeux HTML statiques ou applications simulées).

| Application | Fichier Composant | Description | Accès |
| :--- | :--- | :--- | :--- |
| **Assistant sportif** | `IndexScreen.jsx` | Application d'exemple (e.g., Decathlon) affichée via `/decathlon.html`. | Tous |
| **Jeu Snake** | `SnakeGameScreen.jsx` | Contenu du jeu via `/snake_game.html`. | `root` uniquement |
| **Jeu Pixel** | `PixelgameScreen.jsx` | Contenu du jeu via `/pixel_game.html`. | `root` uniquement |

---

### 4. Paramètres d'Accessibilité (`AccessibilitySettings.jsx`)

Une modale de configuration système (non déplaçable) permettant d'adapter l'interface aux besoins de l'utilisateur.

* **Contrôles :**
    * Taille de la police du Terminal.
    * Contraste Élevé.
    * Sons Système.
    * Animations Réduites.
    * Curseur Agrandit.

---

### 5. Manuel d'Utilisation (`Manual.jsx`)

Ouvre une fenêtre flottante affichant les informations détaillées sur l'utilisation du terminal et les commandes disponibles.

* **Style :** Le contenu est mis en forme pour imiter une page de manuel du système d'exploitation, avec coloration syntaxique des commandes.

## 🗃️ Structure des Fichiers

| Fichier | Rôle |
| :--- | :--- |
| **`App.jsx`** | **Contrôleur Principal.** Gère l'état global (fenêtres, utilisateurs, settings) et la logique d'exécution des commandes. |
| **`index.jsx`** | Point d'entrée de l'application React. |
| **`Terminal.jsx`** | Vue du terminal, gestion de l'affichage de l'historique et de la saisie. |
| **`ChatScreen.jsx`** | Vue et logique du chatbot "IA Paysanne". |
| **`AccessibilitySettings.jsx`** | Vue et contrôles pour les paramètres d'accessibilité. |
| **`Manual.jsx`** | Vue de la fenêtre du manuel d'utilisation. |
| **`IndexScreen.jsx`** | Vue de la fenêtre de l'application Index. |
| **`SnakeGameScreen.jsx`** | Vue de la fenêtre du jeu Snake. |
| **`PixelgameScreen.jsx`** | Vue de la fenêtre du jeu Pixel. |
