import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';

const purgeConfig = {
  content: ['./**/*.tsx', './**/*.html'],
  css: ['frontend/style/dsfr.min.css'],
  safelist: ['anchor-link'],
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
    host: '0.0.0.0',
    port: 3001,
  },
  css: {
    postcss: {
      plugins,
    },
  },
});
