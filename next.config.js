const { withSentryConfig } = require("@sentry/nextjs");
const redirects = require('./redirects.json');

const nextjsConfig = {
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
}

module.exports = process.env.NODE_ENV === "production" && process.env.SENTRY_DSN
  ? withSentryConfig(nextjsConfig, { silent: true, hideSourceMaps: false, token: process.env.SENTRY_AUTH_TOKEN })
  : nextjsConfig;

