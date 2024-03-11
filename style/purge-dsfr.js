module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'postcss-remove-dsfr-font-face',
    AtRule: {
      'font-face'(rule) {
        rule.walkDecls('src', (node) => {
          return false;
        });
      },
    },
  };
};

module.exports.postcss = true;
