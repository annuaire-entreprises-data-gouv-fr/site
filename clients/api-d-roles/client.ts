import { HttpServerError, HttpUnauthorizedError } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { Information } from '#models/exceptions';
import httpClient, { httpGet, IDefaultRequestConfig } from '#utils/network';
import { logInfoInSentry } from '#utils/sentry';
import { URLSearchParams } from 'url';
import { IDRolesAuthTokenResponse } from './interface';

/**
 * D-Roles
 * https://roles.preprod.data.gouv.fr/
 */
class DRolesAPIClient {
  private _token: IDRolesAuthTokenResponse | null;

  constructor(
    private client_id: string | undefined,
    private client_secret: string | undefined
  ) {
    if (!this.client_id || !this.client_secret) {
      throw new HttpServerError('D-Roles env variables are undefined');
    }
    this._token = null;
  }

  private newToken = async () => {
    try {
      const data = await httpClient<IDRolesAuthTokenResponse>({
        url: routes.dRoles.auth.token,
        method: 'POST',
        timeout: constants.timeout.XXXL,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams({
          client_id: this.client_id || '',
          client_secret: this.client_secret || '',
          grant_type: 'client_credentials',
        }).toString(),
      });

      this._token = data;
    } catch (e) {
      this._token = null;
      throw new HttpUnauthorizedError('Failed to get token');
    }
  };

  private isTokenExpired = () => {
    const now = new Date().getTime();
    const tokenExpiryTime = this._token ? this._token.expires_in : 0;
    return now > tokenExpiryTime;
  };

  private getToken = async () => {
    if (!this._token || this.isTokenExpired()) {
      logInfoInSentry(
        new Information({
          name: 'RefreshingDRolesToken',
          message: 'Refreshing D-Roles token',
        })
      );
      await this.newToken();
      if (!this._token) {
        throw new HttpUnauthorizedError('Failed to refresh token');
      }
    }
    return this._token;
  };

  public get = async <T>(
    url: string,
    config: IDefaultRequestConfig
  ): Promise<T> => {
    const token = await this.getToken();

    return httpGet<T>(url, {
      timeout: constants.timeout.M,
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token.access_token}`,
      },
    });
  };
}

const droleApiClient = new DRolesAPIClient(
  process.env.D_ROLES_CLIENT_ID,
  process.env.D_ROLES_CLIENT_SECRET
);

export { droleApiClient };
