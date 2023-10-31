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


module.exports = process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextjsConfig, { silent: true, hideSourceMaps: false })
  : nextjsConfig;



