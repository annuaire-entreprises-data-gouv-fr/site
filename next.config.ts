import { SentryBuildOptions, withSentryConfig } from '@sentry/nextjs';
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
  generateBuildId: () => process.env.SOURCE_VERSION || null,
  async redirects() {
    return redirects;
  },
};

const sentryBuildOptions: SentryBuildOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  sentryUrl: process.env.SENTRY_URL,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // silent: !process.env.CI,
  reactComponentAnnotation: {
    enabled: true,
  },
  telemetry: false,
  widenClientFileUpload: true,
  sourcemaps: {
    disable: DISABLE_SOURCEMAP_UPLOAD,
  },
  release: {
    create: true,
    finalize: true,
    name: process.env.SOURCE_VERSION,
    setCommits: {
      ignoreMissing: true,
      auto: true,
    },
  },
};

export default WITH_SENTRY
  ? withSentryConfig(nextConfig, sentryBuildOptions)
  : nextConfig;