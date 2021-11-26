module.exports = {
  async redirects() {
    return [
      {
        source: '/callback',
        destination: '/api/login',
        permanent: true,
      },
    ];
  },
};
