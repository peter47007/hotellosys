// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Add it to the plugins array
  ],
  resolve: {
    alias: {
      // 3. This ensures your '@/' imports point to the new 'src' folder
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 4. Proxy API calls to your backend server
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});