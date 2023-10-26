const redirects = require('./redirects.json');

module.exports = {
  webpack: function (config) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'js-yaml-loader',
    });
    return config;
  },
  async redirects() {
    return redirects;
  },
};
