/// <reference types="vitest"/>
import {defineConfig, splitVendorChunkPlugin} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.gltf', '**/*.bin', '**/*.png', '**/*.jpg', '**/*.jpeg'],
  plugins: [
    react(),
    splitVendorChunkPlugin()
  ],
  // Workaround to make it work on I:\  - https://github.com/vitejs/vite/issues/4635
  resolve: {

    preserveSymlinks: true
  },
  build: {
    outDir: 'build',
    assetsDir: '',
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    reporters: ["default", process.env.CI ? "vitest-sonar-reporter" : ""],
    outputFile: process.env.CI ? "test-report.xml" : undefined,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**"],
      exclude: ["**/__mocks__/**", "**/models/**", "**/*.d.ts"],
    },
  },
});
