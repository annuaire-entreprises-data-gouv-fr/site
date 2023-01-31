const getEnvValue = (key: string, nullable = false): string | undefined => {
  const value = process.env[key];
  if (typeof value === 'undefined') {
    const msg = `Env variable is undefined: ${key}`;
    if (!nullable) {
      throw new Error(msg);
    } else {
      console.warn(msg);
    }
  }
  return value;
};

const initializeEnvConfig = () => {
  return {
    // insee connexion
    INSEE_CLIENT_ID: getEnvValue('INSEE_CLIENT_ID'),
    INSEE_CLIENT_SECRET: getEnvValue('INSEE_CLIENT_SECRET'),
    // insee connexion fallback
    INSEE_CLIENT_ID_FALLBACK: getEnvValue('INSEE_CLIENT_ID_FALLBACK'),
    INSEE_CLIENT_SECRET_FALLBACK: getEnvValue('INSEE_CLIENT_SECRET_FALLBACK'),
    // session password
    IRON_SESSION_PWD: getEnvValue('IRON_SESSION_PWD'),
    // mon compte pro authent
    MONCOMPTEPRO_CLIENT_ID: getEnvValue('MONCOMPTEPRO_CLIENT_ID'),
    MONCOMPTEPRO_CLIENT_SECRET: getEnvValue('MONCOMPTEPRO_CLIENT_SECRET'),
    MONCOMPTEPRO_POST_LOGOUT_REDIRECT_URI: getEnvValue(
      'MONCOMPTEPRO_POST_LOGOUT_REDIRECT_URI'
    ),
    MONCOMPTEPRO_REDIRECT_URI: getEnvValue('MONCOMPTEPRO_REDIRECT_URI'),
    MONCOMPTEPRO_URL: getEnvValue('MONCOMPTEPRO_URL'),
    // RNCS API PROXY KEY
    // OPTIONALS
    REDIS_URL: getEnvValue('REDIS_URL', true),
    PROXY_API_KEY: getEnvValue('PROXY_API_KEY', true),
    ALTERNATIVE_SEARCH_ROUTE: getEnvValue('ALTERNATIVE_SEARCH_ROUTE', true),
    MATOMO_SITE_ID: getEnvValue('MATOMO_SITE_ID', true),
    MATTERMOST_HOOK: getEnvValue('MATTERMOST_HOOK', true),
    SENTRY_DSN: getEnvValue('SENTRY_DSN', true),
    UPTIME_ROBOT_API_KEY: getEnvValue('UPTIME_ROBOT_API_KEY'),
    VITE_SENTRY_FRONT_DSN: getEnvValue('VITE_SENTRY_FRONT_DSN', true),
    INSTANCE_NUMBER: getEnvValue('INSTANCE_NUMBER', true),
  };
};

const env = initializeEnvConfig();
export default env;
