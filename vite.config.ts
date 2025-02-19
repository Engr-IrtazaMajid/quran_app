import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globDirectory: 'dist', // Change from dev-dist to dist
        globPatterns: ['**/*.{js,wasm,css,html}'],
        globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
      },
    }),
  ],
});
