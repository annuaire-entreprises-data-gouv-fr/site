const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    appDir: true,
  },
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
});
