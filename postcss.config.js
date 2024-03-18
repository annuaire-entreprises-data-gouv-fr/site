module.exports = {
  plugins: [
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
        fontFace: true,
      },
    ],
    'postcss-flexbugs-fixes',
    ['postcss-preset-env', {}],
    [
      'cssnano',
      {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
            calc: false,
          },
        ],
      },
    ],
  ],
};
