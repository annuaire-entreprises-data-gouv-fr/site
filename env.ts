const getEnvValue = (
  key: string,
  value?: string,
  nullable = false
): string | undefined => {
  if (typeof value === 'undefined' && !nullable) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return value;
};

const getConfig = () => {
  // prettier-ignore
  return {
    ALTERNATIVE_SEARCH_ROUTE: getEnvValue('ALTERNATIVE_SEARCH_ROUTE', process.env.ALTERNATIVE_SEARCH_ROUTE, true),
    INSEE_CLIENT_ID_FALLBACK: getEnvValue('INSEE_CLIENT_ID_FALLBACK', process.env.INSEE_CLIENT_ID_FALLBACK),
    INSEE_CLIENT_ID: getEnvValue('INSEE_CLIENT_ID', process.env.INSEE_CLIENT_ID),
    INSEE_CLIENT_SECRET_FALLBACK: getEnvValue('INSEE_CLIENT_SECRET_FALLBACK', process.env.INSEE_CLIENT_SECRET_FALLBACK),
    INSEE_CLIENT_SECRET: getEnvValue('INSEE_CLIENT_SECRET', process.env.INSEE_CLIENT_SECRET),
    INSEE_DIRIGEANT_CLIENT_ID: getEnvValue('INSEE_DIRIGEANT_CLIENT_ID', process.env.INSEE_DIRIGEANT_CLIENT_ID),
    INSEE_DIRIGEANT_CLIENT_SECRET: getEnvValue('INSEE_DIRIGEANT_CLIENT_SECRET', process.env.INSEE_DIRIGEANT_CLIENT_SECRET),
    IRON_SESSION_PWD: getEnvValue('IRON_SESSION_PWD', process.env.IRON_SESSION_PWD),
    MATOMO_SITE_ID: getEnvValue('MATOMO_SITE_ID', process.env.MATOMO_SITE_ID, true),
    MATTERMOST_HOOK: getEnvValue('MATTERMOST_HOOK', process.env.MATTERMOST_HOOK, true),
    MONCOMPTEPRO_CLIENT_ID: getEnvValue('MONCOMPTEPRO_CLIENT_ID', process.env.MONCOMPTEPRO_CLIENT_ID),
    MONCOMPTEPRO_CLIENT_SECRET: getEnvValue('MONCOMPTEPRO_CLIENT_SECRET', process.env.MONCOMPTEPRO_CLIENT_SECRET),
    MONCOMPTEPRO_POST_LOGOUT_REDIRECT_URI: getEnvValue('MONCOMPTEPRO_POST_LOGOUT_REDIRECT_URI', process.env.MONCOMPTEPRO_POST_LOGOUT_REDIRECT_URI),
    MONCOMPTEPRO_REDIRECT_URI: getEnvValue('MONCOMPTEPRO_REDIRECT_URI', process.env.MONCOMPTEPRO_REDIRECT_URI),
    MONCOMPTEPRO_URL: getEnvValue('MONCOMPTEPRO_URL', process.env.MONCOMPTEPRO_URL),
    PROXY_API_KEY: getEnvValue('PROXY_API_KEY', process.env.PROXY_API_KEY),
    REDIS_URL: getEnvValue('REDIS_URL', process.env.REDIS_URL),
    SENTRY_DSN: getEnvValue('SENTRY_DSN', process.env.SENTRY_DSN, true),
    SITE_URL: getEnvValue('SITE_URL', process.env.SITE_URL, true),
    UPTIME_ROBOT_API_KEY: getEnvValue('UPTIME_ROBOT_API_KEY', process.env.UPTIME_ROBOT_API_KEY),
    VITE_SENTRY_FRONT_DSN: getEnvValue('VITE_SENTRY_FRONT_DSN', process.env.VITE_SENTRY_FRONT_DSN, true),
  };
};

const env = getConfig();
export default env;
