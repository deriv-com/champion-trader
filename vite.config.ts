import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      VITE_WS_URL: JSON.stringify(process.env.VITE_WS_URL),
      VITE_WS_PUBLIC_PATH: JSON.stringify(process.env.VITE_WS_PUBLIC_PATH),
      VITE_WS_PROTECTED_PATH: JSON.stringify(process.env.VITE_WS_PROTECTED_PATH),
      VITE_REST_URL: JSON.stringify(process.env.VITE_REST_URL)
    }
  },
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4113,
    open: true,
    host: 'localhost',
    strictPort: true,
  },
});
