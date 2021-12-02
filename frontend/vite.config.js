const legacy = require('@vitejs/plugin-legacy');

const autoprefixer = require('autoprefixer');

const purgeConfig = {
  content: ['./**/*.tsx', './**/*.html'],
  css: ['frontend/css/dsfr.min.css'],
  fontFace: false, // otherwise, it will remove dsfr icon
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
    outDir: '../public',
    assetsDir: 'assets',
    emptyOutDir: false,
    manifest: true,
    rollupOptions: {
      input: 'frontend/js/production.js',
    },
  },
  server: {
    port: 3001,
    fs: {
      // allow: ['./js', './css', './fonts'],
    },
  },
  plugins: [
    legacy({
      targets: ['defaults', 'ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  css: {
    postcss: {
      plugins,
    },
  },
};
