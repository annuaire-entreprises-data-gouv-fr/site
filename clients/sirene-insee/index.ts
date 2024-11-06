import { HttpServerError, HttpUnauthorizedError } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { Information } from '#models/exceptions';
import httpClient, { httpGet, IDefaultRequestConfig } from '#utils/network';
import { logInfoInSentry } from '#utils/sentry';
import { URLSearchParams } from 'url';

type IAccessToken = {
  data: {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: 'Bearer' | string;
  };
  tokenExpiryTime: number;
};

export class httpInseeClient {
  private _token: IAccessToken | null;

  constructor(
    private token_url: string,
    private client_id: string | undefined,
    private client_secret: string | undefined,
    private username: string | undefined,
    private password: string | undefined
  ) {
    if (
      (!this.client_id ||
        !this.client_secret ||
        !this.token_url ||
        !this.username ||
        !this.password) &&
      process.env.NODE_ENV === 'production'
    ) {
      throw new HttpServerError('An insee env variable is undefined');
    }
    this._token = null;
  }

  newToken = async () => {
    try {
      const data = await httpClient<IAccessToken['data']>({
        url: this.token_url,
        method: 'POST',
        timeout: constants.timeout.XXS,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams({
          client_id: this.client_id || '',
          client_secret: this.client_secret || '',
          grant_type: 'password',
          validity_period: '604800',
          username: this.username || '',
          password: this.password || '',
        }).toString(),
      });
      this._token = {
        data,
        tokenExpiryTime: new Date().getTime() + data.expires_in * 1000,
      };
    } catch (e) {
      this._token = null;
    }
  };

  isTokenExpired = () => {
    const now = new Date().getTime();
    const tokenExpiryTime = this._token ? this._token.tokenExpiryTime : 0;
    return now > tokenExpiryTime;
  };

  getToken = async () => {
    // in case something went wrong during the last refresh
    if (!this._token || this.isTokenExpired()) {
      logInfoInSentry(
        new Information({
          name: 'RefreshingInseeToken',
          message: 'Refreshing Insee token',
        })
      );
      await this.newToken();
      if (!this._token) {
        throw new HttpUnauthorizedError('Failed to refresh token');
      }
    }
    return this._token;
  };

  get = async (url: string, config: IDefaultRequestConfig) => {
    const token = await this.getToken();

    return httpGet(url, {
      timeout: constants.timeout.M,
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
  };
}

/**
 * Insee client
 *
 * 0Auth client gets instanced twice :
 *
 * One default client used for most calls
 * One fallback client that use a different secret/id - used when first client gets rate limited
 *
 * NB: we want to limit instance to share the /token authentication calls
 */

const defaultClient = new httpInseeClient(
  routes.sireneInsee.auth,
  process.env.INSEE_CLIENT_ID,
  process.env.INSEE_CLIENT_SECRET,
  process.env.INSEE_USERNAME,
  process.env.INSEE_PASSWORD
);

const fallbackClient = new httpInseeClient(
  routes.sireneInsee.auth,
  process.env.INSEE_CLIENT_ID_FALLBACK,
  process.env.INSEE_CLIENT_SECRET_FALLBACK,
  process.env.INSEE_USERNAME,
  process.env.INSEE_PASSWORD
);

/**
 * Insee API client
 *
 * @param route
 * @param config
 * @param useFallback use fallback credentials
 * @returns
 */
export async function inseeClientGet<T>(
  route: string,
  config: IDefaultRequestConfig = {},
  useFallback = false
): Promise<T> {
  const client = useFallback ? fallbackClient : defaultClient;
  return (await client.get(route, {
    timeout: constants.timeout.S,
    ...config,
  })) as T;
}
