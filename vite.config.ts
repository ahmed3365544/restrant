import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // ✅ المسار الجذري
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
