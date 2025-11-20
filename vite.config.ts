import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration pour React avec support de process.env
export default defineConfig({
  plugins: [react()],
  define: {
    // Cela permet d'éviter que 'process' ne soit indéfini dans le navigateur
    // et permet à votre code existant (process.env.API_KEY) de fonctionner.
    'process.env': {}
  }
})