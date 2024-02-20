module.exports = {
  // plugins.push(autoprefixer());
  // plugins.push(require('cssnano'));
  plugins: [
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {},
      // {
      //   autoprefixer: {
      //     flexbox: 'no-2009',
      //   },
      //   stage: 3,
      //   features: {
      //     'custom-properties': false,
      //   },
      // },
    ],
    [
      '@fullhuman/postcss-purgecss',
      {
        css: ['frontend/style/dsfr.min.css'],
        content: [
          './pages/**/*.{js,jsx,ts,tsx}',
          './app/**/*.{js,jsx,ts,tsx}',
          './components/**/*.{js,jsx,ts,tsx}',
          './components-ui/**/*.{js,jsx,ts,tsx}',
        ],
        safelist: ['html', 'body', 'anchor-link'],
      },
    ],
  ],
};
