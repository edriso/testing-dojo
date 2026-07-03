/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/testing-dojo/',
  plugins: [react()],
  test: {
    // Tests run against a real-ish browser DOM provided by jsdom.
    environment: 'jsdom',
    // Makes describe / it / expect available without importing them.
    globals: true,
    // Runs once before every test file: registers jest-dom matchers
    // and starts the mock API server. See src/test/setup.ts.
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      // We measure coverage of the example library code we are teaching with,
      // not the lesson UI. Coverage is a guide, never a goal in itself.
      include: ['src/lib/**', 'src/components/examples/**'],
      reporter: ['text', 'html'],
    },
  },
})
