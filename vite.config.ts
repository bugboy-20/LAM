/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import variables from './src/variables.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('capacitor-')
        }
      }
    }),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  server: {
    proxy: {
      '/api': {
        target: variables.apiURL,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/0x0st': {
        target: 'https://0x0.st',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/0x0st/, ''),
      },
      '/leaflet': {
        target: 'https://tile.openstreetmap.org',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/leaflet/, ''),
      }
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    }
  },
  optimizeDeps : {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  }
})
