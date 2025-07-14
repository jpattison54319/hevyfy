/// <reference types="vitest"/>
import {defineConfig, splitVendorChunkPlugin} from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.gltf', '**/*.bin', '**/*.png', '**/*.jpg', '**/*.jpeg'],
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'XPets',
        name: 'XPets: HealthQuest',
        start_url: '.',
        display: 'standalone',
        background_color: '#161616',
        theme_color: '#161616',
        icons: [
          {
            src: 'logo64.png',
            type: 'image/png',
            sizes: '64x64'
          },
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        globIgnores: [
          '**/vendor-*.js',   
          '**/*.gltf',
          '**/*.glb',
          '**/*.bin',
          '**/*.png',
          '**/*.jpg',
          '**/*.jpeg',
          '**/*.webp',
          '**/*.ktx2',
          '**/textures/**',
          '**/models/**',
          '**/kitten/**',
        ],
      },
      devOptions: {
        enabled: true
      }
    })
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
