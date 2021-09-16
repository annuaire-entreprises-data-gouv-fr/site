module.exports = {
  apps: [
    {
      name: 'www',
      cwd: '/opt/apps/annuaire-entreprises/current',
      script: './server.js',
      // script: './node_modules/.bin/next',
      // args: 'start -p 3000',
      exec_mode: 'cluster',
      instances: 'max',
      log_file: '/var/log/annuaire-entreprises/app.log',
      error_file: '/var/log/annuaire-entreprises/err.log',
      out_file: '/var/log/annuaire-entreprises/out.log',
      time: true,
      env: {
        NODE_ENV: 'production',
        app_port: 3000,
      },
    },
  ],

  deploy: {
    staging: {
      user: 'www-data',
      host: 'staging.annuaire-entreprises-infra.data.gouv.fr',
      key: 'deploy.key',
      ref: 'origin/main',
      repo: 'https://github.com/etalab/annuaire-entreprises.data.gouv.fr.git',
      path: '/opt/apps/annuaire-entreprises',
      'post-deploy':
        'ln -sfn ../.env .env && npm install && npm run build && /usr/local/lib/npm/bin/pm2 startOrRestart ecosystem.config.js',
      env: {
        NODE_ENV: 'production',
      },
    },
    production: {
      user: 'www-data',
      host: 'production.annuaire-entreprises-infra.data.gouv.fr',
      key: 'deploy.key',
      ref: 'origin/main',
      repo: 'https://github.com/etalab/annuaire-entreprises.data.gouv.fr.git',
      path: '/opt/apps/annuaire-entreprises',
      'post-deploy':
        'ln -sfn ../.env .env && npm install && npm run build && /usr/local/lib/npm/bin/pm2 startOrRestart ecosystem.config.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
