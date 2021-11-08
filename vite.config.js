const legacy = require('@vitejs/plugin-legacy');

const autoprefixer = require('autoprefixer');

const purgeConfig = {
  content: ['./**/*.tsx', './**/*.html'],
  css: ['frontend/css/dsfr.css'],
  fontFace: false, // otherwise, it will remove dsfr icon
  variables: true,
};

const purgecss = require('@fullhuman/postcss-purgecss')(purgeConfig);
const plugins = [];

if (process.env.NODE_ENV === 'production') {
  plugins.push(purgecss);
  plugins.push(autoprefixer());
  plugins.push(require('cssnano'));
}

module.exports = {
  publicDir: false,
  clearScreen: false,
  build: {
    outDir: 'public',
    assetsDir: 'assets',
    emptyOutDir: false,
    target: ['es2020', 'chrome61', 'firefox60', 'safari11', 'edge18'],
    manifest: true,
    rollupOptions: {
      input: 'frontend/js/production.js',
    },
  },
  server: {
    port: 3001,
  },
  plugins: [
    legacy({
      targets: ['defaults', 'ie >= 11'],
    }),
  ],
  css: {
    postcss: {
      plugins,
    },
  },
};
