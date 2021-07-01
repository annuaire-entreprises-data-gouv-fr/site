module.exports = {
  apps: [
    {
      name: 'www',
      cwd: '/opt/apps/annuaire-entreprises',
      script: './node_modules/.bin/next',
      args: 'start -p {{ app_port }}',
      exec_mode: 'cluster',
      instances: 'max',
      log_file: '/var/log/annuaire-entreprises/app.log',
      error_file: '/var/log/annuaire-entreprises/err.log',
      out_file: '/var/log/annuaire-entreprises/out.log',
      time: true,
    },
  ],

  deploy: {
    staging: {
      user: 'annuaire-entreprises',
      // host: 'staging.annuaire-entreprises-infra.data.gouv.fr',
      host: '149.202.167.79',
      ref: 'origin/ansible-deployment',
      repo: 'https://github.com/etalab/annuaire-entreprises.data.gouv.fr.git',
      path: '/opt/apps/annuaire-entreprises',
      'post-deploy':
        'ln -sfn ../.env .env ; npm install && npm run build && /usr/local/lib/npm/bin/pm2 startOrRestart ecosystem.config.js --env production',
      'pre-deploy-local': "echo 'This is a local executed command'",
      env: {
        NODE_ENV: 'production',
        app_port: 3000,
      },
    },
  },
};
