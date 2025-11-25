import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement (comme API_KEY)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Important : Remplace process.env.API_KEY par sa valeur lors du build
      // pour que le SDK Google GenAI fonctionne côté client.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': {} // Évite les crashs si d'autres process.env sont accédés
    }
  };
});