import { httpClientOAuthFactory } from '../../utils/network';
import routes from '../routes';

/**
 * API Dirigeant by INSEE
 *
 * Verify that a personn identity matches one of the company leaders
 *
 */

const inseeDirigeantClient = httpClientOAuthFactory(
  routes.dirigeantInsee.auth,
  process.env.INSEE_DIRIGEANT_CLIENT_ID,
  process.env.INSEE_DIRIGEANT_CLIENT_SECRET
);

export default inseeDirigeantClient;
