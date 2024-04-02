const { withSentryConfig } = require('@sentry/nextjs');
const redirects = require('./redirects.json');

const WITH_SENTRY =
  !!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production';

const DISABLE_SOURCEMAP_UPLOAD =
  process.env.SENTRY_DISABLE_SOURCEMAP_UPLOAD === 'true';

if (DISABLE_SOURCEMAP_UPLOAD) {
  console.warn(`
  
--------------------------------------------------------
WARNING: Building without uploading sourcemap to Sentry
(probably because https://errors.data.gouv.fr is down)
--------------------------------------------------------

`);
}
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
  ...(WITH_SENTRY
    ? {
        sentry: {
          widenClientFileUpload: true,
          ...(DISABLE_SOURCEMAP_UPLOAD
            ? {
                disableServerWebpackPlugin: true,
                disableClientWebpackPlugin: true,
              }
            : {}),
        },
      }
    : {}),
};

module.exports = WITH_SENTRY
  ? withSentryConfig(nextjsConfig, {
      silent: true,
      hideSourceMaps: false,
      ignore: [],
    })
  : nextjsConfig;
