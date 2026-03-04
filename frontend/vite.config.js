import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router')) return 'vendor';
            if (id.includes('react-hook-form') || id.includes('react-toastify') || id.includes('react-icons')) return 'ui';
            if (id.includes('zustand') || id.includes('axios') || id.includes('i18next')) return 'state';
          }
        },
      },
    },
    sourcemap: false,
    target: 'esnext',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    exclude: ['**/node_modules/**', '**/src/utils/helpers.test.js'],
  },
})
