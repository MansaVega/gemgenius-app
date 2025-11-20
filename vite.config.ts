import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration pour React avec support des variables d'environnement Netlify
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement (support local .env et système)
  const env = loadEnv(mode, '.', '');
  
  // RÉCUPÉRATION PRIORITAIRE DE LA CLÉ
  // 1. Env chargée par Vite (local .env)
  // 2. Process env direct (Netlify CI/CD system env)
  // 3. VITE_API_KEY (convention Vite standard)
  const rawApiKey = env.API_KEY || process.env.API_KEY || process.env.VITE_API_KEY || '';
  
  // Nettoyage de la clé
  const apiKey = rawApiKey.trim();

  // Logs de build pour débogage Netlify
  if (!apiKey) {
    console.warn("⚠️ ATTENTION BUILD: Aucune API_KEY trouvée !");
  } else {
    console.log(`✅ SUCCÈS BUILD: API_KEY injectée via __APP_API_KEY__`);
  }
  
  return {
    plugins: [react()],
    define: {
      // INJECTION DIRECTE : On crée une variable globale disponible dans le navigateur
      '__APP_API_KEY__': JSON.stringify(apiKey)
      
      // J'ai retiré 'process.env': {} car cela peut bloquer le post-processing Netlify
    }
  }
})