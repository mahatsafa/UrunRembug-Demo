import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vite = alat untuk menjalankan (npm run dev) dan mem-build (npm run build) aplikasi React.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Recharts cukup besar; untuk demo satu halaman ini tidak masalah.
  build: { chunkSizeWarningLimit: 900 },
  test: { environment: 'node' },
});
