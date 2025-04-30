import { defineConfig } from 'vite';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
        background: resolve(__dirname, 'src/background.js'),
        contentScript: resolve(__dirname, 'src/contentScript.js')
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  },
  plugins: [
    // Copy manifest.json and icons to the dist folder
    copy({
      targets: [
        {
          src: 'manifest.json',
          dest: 'dist'
        },
        {
          src: 'icons/*',
          dest: 'dist/icons'
        }
      ],
      hook: 'writeBundle'
    })
  ]
});