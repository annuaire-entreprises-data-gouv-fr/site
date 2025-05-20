import { HttpServerError, HttpUnauthorizedError } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { Information } from '#models/exceptions';
import httpClient, { httpGet, IDefaultRequestConfig } from '#utils/network';
import { logInfoInSentry } from '#utils/sentry';
import { URLSearchParams } from 'url';
import {
  IDRolesAuthTokenResponse,
  IDRolesGroupSearchResponse,
  IDRolesRoles,
  IDRolesUser,
} from './interface';

/**
 * D-Roles
 * https://roles.preprod.data.gouv.fr/
 */
class DRolesAPIClient {
  private _token: {
    data: IDRolesAuthTokenResponse;
    tokenExpiryTime: number;
  } | null;

  constructor(
    private client_id: string | undefined,
    private client_secret: string | undefined
  ) {
    if (
      (!this.client_id || !this.client_secret) &&
      process.env.NODE_ENV === 'production'
    ) {
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

      this._token = {
        data,
        tokenExpiryTime: new Date().getTime() + 240 * 1000, // 4 minutes default expiry
      };
    } catch (e) {
      this._token = null;
      throw new HttpUnauthorizedError('Failed to get token');
    }
  };

  private isTokenExpired = () => {
    const now = new Date().getTime();
    const tokenExpiryTime = this._token ? this._token.tokenExpiryTime : 0;
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

  private get = async <T>(
    url: string,
    config: IDefaultRequestConfig
  ): Promise<T> => {
    const token = await this.getToken();

    return httpGet<T>(url, {
      timeout: constants.timeout.M,
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
  };

  public getGroupsByEmail = async (
    email: string
  ): Promise<IDRolesGroupSearchResponse> => {
    try {
      const route = routes.dRoles.groups.getGroupsByEmail(email);
      return await this.get<IDRolesGroupSearchResponse>(route, {});
    } catch (error) {
      if (error instanceof HttpUnauthorizedError) {
        return [];
      }
      throw error;
    }
  };

  public getRoles = async (): Promise<IDRolesRoles[]> => {
    const route = routes.dRoles.roles.getRoles();
    return await this.get<IDRolesRoles[]>(route, {});
  };

  public getUserByEmail = async (email: string): Promise<IDRolesUser> => {
    const route = routes.dRoles.users.getByEmail(email);
    return await this.get<IDRolesUser>(route, {});
  };

  public addUserToGroup = async (
    groupId: number,
    email: string,
    roleId: number
  ): Promise<null> => {
    const user = await this.getUserByEmail(email);
    const route = routes.dRoles.groups.addUserToGroup(groupId, user.id, roleId);
    return await this.get<null>(route, {
      method: 'PUT',
      data: { email },
    });
  };

  public removeUserFromGroup = async (
    groupId: number,
    userId: number
  ): Promise<void> => {
    const route = routes.dRoles.groups.removeUserFromGroup(groupId, userId);

    await this.get<null>(route, {
      method: 'DELETE',
    });
  };
}

const droleApiClient = new DRolesAPIClient(
  process.env.D_ROLES_CLIENT_ID,
  process.env.D_ROLES_CLIENT_SECRET
);

export { droleApiClient };
