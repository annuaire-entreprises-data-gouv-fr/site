const { withSentryConfig } = require("@sentry/nextjs");

const nextjsConfig = {
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
}

module.exports = process.env.NODE_ENV === "production" && process.env.SENTRY_DSN
  ? withSentryConfig(nextjsConfig, { silent: true, hideSourceMaps: false })
  : nextjsConfig;

