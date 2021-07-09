module.exports = {
  apps: [
    {
      name: 'www',
      cwd: '/opt/apps/annuaire-entreprises',
      script: './node_modules/.bin/next',
      args: 'start -p 3000',
      exec_mode: 'cluster',
      instances: 'max',
      log_file: '/var/log/annuaire-entreprises/app.log',
      error_file: '/var/log/annuaire-entreprises/err.log',
      out_file: '/var/log/annuaire-entreprises/out.log',
      time: true,
    },
  ],
};
