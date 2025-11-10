import { defineConfig } from 'vitest/config';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vueJsx()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.*'],
    coverage: {
      clean: true,
      reporter: ['text', 'html', 'lcov'],
      provider: 'v8',
      include: ['src'],
      exclude: ['src/index.tsx', 'src/vite-env.d.ts'],
    },
  },
});
