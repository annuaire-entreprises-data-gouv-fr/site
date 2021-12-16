module.exports = {
  async redirects() {
    return [
      {
        source: '/callback',
        destination: '/api/compte/callback',
        permanent: true,
      },
    ];
  },
};
