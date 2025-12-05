import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Le 'base: /' assure que les chemins absolus (comme /snake_game.html) fonctionnent bien
  base: '/', 
  build: {
    // Vercel utilisera ce dossier pour les fichiers statiques du frontend
    outDir: 'dist',
  }
})