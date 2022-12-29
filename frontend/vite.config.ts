import path from 'path';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';

const purgeConfig = {
  content: ['./**/*.tsx', './**/*.html'],
  css: ['frontend/style/dsfr.min.css'],
};

const purgecss = require('@fullhuman/postcss-purgecss')(purgeConfig);
const plugins = [];

if (process.env.NODE_ENV === 'production') {
  plugins.push(purgecss);
  plugins.push(autoprefixer());
  plugins.push(require('cssnano'));
}

export default defineConfig({
  publicDir: false,
  appType: 'custom', // not a SPA
  envDir: '..', // .env directory
  clearScreen: false, // do not clear console
  resolve: {
    alias: [
      {
        find: '#clients',
        replacement: path.resolve(__dirname, '../clients'),
      },
      {
        find: '#components',
        replacement: path.resolve(__dirname, '../components'),
      },
      {
        find: '#components-ui',
        replacement: path.resolve(__dirname, '../components-ui'),
      },
      {
        find: '#models',
        replacement: path.resolve(__dirname, '../models'),
      },
      {
        find: '#utils',
        replacement: path.resolve(__dirname, '../utils'),
      },
    ],
  },
  build: {
    outDir: '../public',
    assetsDir: 'assets',
    emptyOutDir: false, // do not empty dir
    manifest: true,
    rollupOptions: {
      input: 'frontend/src/index.js',
    },
  },
  server: {
    port: 3001,
  },
  css: {
    postcss: {
      plugins,
    },
  },
});
