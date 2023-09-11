import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: 'coverage',
    },
    alias: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
  },
});
