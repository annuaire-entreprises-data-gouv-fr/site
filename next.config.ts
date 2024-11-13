import { withSentryConfig } from '@sentry/nextjs';
import { NextConfig } from 'next';
import redirects from './redirects.json';

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
const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'js-yaml-loader',
    });
    // https://github.com/open-telemetry/opentelemetry-js/issues/4173
    // "Critical dependency: the request of a dependency is an expression"
    // This ignores warnings we can't fix.
    if (isServer) {
      config.ignoreWarnings = [{ module: /opentelemetry/ }];
    }
    return config;
  },
  // https://github.com/nexdrew/next-build-id
  // If Scalingo is deploying, SOURCE_VERSION is set to the latest Git commit hash
  generateBuildId: () => process.env.SOURCE_VERSION || null,
  async redirects() {
    return redirects;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Debug-Deployment',
            value: `Instance-Number-${
              process.env.INSTANCE_NUMBER
            }-Date-${new Date().toISOString()}`,
          },
        ],
      },
    ];
  },
};

export default WITH_SENTRY
  ? withSentryConfig(nextConfig, {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      sentryUrl: process.env.SENTRY_URL,
      authToken: process.env.SENTRY_AUTH_TOKEN,

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      /**
       * Options related to react component name annotations.
       * Disabled by default, unless a value is set for this option.
       * When enabled, your app's DOM will automatically be annotated during build-time with their respective component names.
       * This will unlock the capability to search for Replays in Sentry by component name, as well as see component names in breadcrumbs and performance monitoring.
       * Please note that this feature is not currently supported by the esbuild bundler plugins, and will only annotate React components
       */
      reactComponentAnnotation: {
        enabled: true,
      },
      /**
       * Suppresses all Sentry SDK build logs.
       *
       * Defaults to `false`.
       */
      telemetry: true,
      /**
       * Include Next.js-internal code and code from dependencies when uploading source maps.
       *
       * Note: Enabling this option can lead to longer build times.
       * Disabling this option will leave you without readable stacktraces for dependencies and Next.js-internal code.
       *
       * Defaults to `false`.
       */
      widenClientFileUpload: true,
      /**
       * Options for source maps uploading.
       */
      sourcemaps: {
        /**
         * Disable any functionality related to source maps upload.
         */
        disable: DISABLE_SOURCEMAP_UPLOAD,
      },
    })
  : nextConfig;
