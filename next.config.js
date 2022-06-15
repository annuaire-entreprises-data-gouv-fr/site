const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  webpack: function (config) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'js-yaml-loader',
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/api/qr/:slug',
        destination: '/api/share/qr/:slug',
        permanent: true,
      },
    ];
  },
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports);
