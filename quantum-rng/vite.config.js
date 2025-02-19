import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  base: '/quantum-rng/',
  plugins: [react()],
  server: {
    proxy: {
      '/vacuumquantum': {
        target: env.VITE_BACKEND_URL, // Your backend URL
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/vacuumquantum/, ''), // Optional
      },
      '/auth': {
        target: env.VITE_BACKEND_URL, // Your backend URL
        changeOrigin: true,        
        // rewrite: (path) => path.replace(/^\/vacuumquantum/, ''), // Optional
      },
      '/backend': {
        target: env.VITE_BACKEND_URL, // Your backend URL
        changeOrigin: true,        
        rewrite: (path) => path.replace(/^\/backend/, ''), // Optional
      },
      '/backend/event': {
        target: env.VITE_BACKEND_URL, // Your backend URL
        changeOrigin: true,
        ws:true,       
        rewrite: (path) => path.replace(/^\/backend/, ''), // Optional
      },
    },
    
  },
};
});
