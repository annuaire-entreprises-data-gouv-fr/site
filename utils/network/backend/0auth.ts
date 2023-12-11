import { HttpServerError, HttpUnauthorizedError } from '#clients/exceptions';
import constants from '#models/constants';
import { Information } from '#models/exceptions';
import { logInfoInSentry } from '#utils/sentry';
import httpClient, { IDefaultRequestConfig, httpGet } from '..';

type IAccessToken = {
  data: {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: 'Bearer' | string;
  };
  tokenExpiryTime: number;
};

export class httpClientOAuth {
  private _token: IAccessToken | null;

  constructor(
    private token_url: string,
    private client_id: string | undefined,
    private client_secret: string | undefined
  ) {
    if (
      (!this.client_id || !this.client_secret || !this.token_url) &&
      process.env.NODE_ENV === 'production'
    ) {
      throw new HttpServerError('Client id or client secret is undefined');
    }
    this._token = null;
  }

  newToken = async () => {
    try {
      const data = await httpClient<IAccessToken['data']>({
        url: this.token_url,
        method: 'POST',
        timeout: constants.timeout.XXS,
        params: {
          client_id: this.client_id,
          client_secret: this.client_secret,
          grant_type: 'client_credentials',
          validity_period: 604800,
        },
        useCache: false,
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
      useCache: config.useCache || false,
    });
  };
}
