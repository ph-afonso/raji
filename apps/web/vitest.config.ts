import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.ts'],
  },
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src'),
      layouts: resolve(__dirname, 'src/layouts'),
      pages: resolve(__dirname, 'src/pages'),
      components: resolve(__dirname, 'src/components'),
      boot: resolve(__dirname, 'src/boot'),
      stores: resolve(__dirname, 'src/stores'),
      composables: resolve(__dirname, 'src/composables'),
    },
  },
});
