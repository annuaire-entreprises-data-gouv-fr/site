module.exports = {
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
      // FC
      {
        source: '/callback',
        destination: '/api/auth/callback',
        permanent: true,
      },
      {
        source: '/logout',
        destination: '/api/auth/logout/callback',
        permanent: true,
      },
    ];
  },
};
