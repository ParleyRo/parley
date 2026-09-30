import { defineConfig } from 'vite';
export default defineConfig({
  publicDir: false, base: '/assets/build/',
  build: { outDir: 'public/build', emptyOutDir: true, manifest: true, rolldownOptions: { input: 'frontend/main.ts' } },
});
