import { HttpServerError, HttpUnauthorizedError } from "#clients/exceptions";
import routes from "#clients/routes";
import constants from "#models/constants";
import httpClient, { type IDefaultRequestConfig } from "#utils/network";
import { URLSearchParams } from "url";
import type { IRolesDataAuthTokenResponse } from "./interface";

/**
 * Roles.data
 * https://roles.preprod.data.gouv.fr/
 */
class RolesDataAPIClient {
  private _accessToken: string | null;
  private _tokenExpiryTime: number;

  constructor(
    private client_id: string | undefined,
    private client_secret: string | undefined
  ) {
    if (!this.client_id || !this.client_secret) {
      throw new HttpServerError("Roles.data env variables are undefined");
    }
    this._accessToken = null;
    this._tokenExpiryTime = 0;
  }

  private newToken = async () => {
    try {
      const url = `${process.env.D_ROLES_URL}${routes.rolesData.auth.token}`;

      const data = await httpClient<IRolesDataAuthTokenResponse>({
        url,
        method: "POST",
        timeout: constants.timeout.XXXL,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: new URLSearchParams({
          client_id: this.client_id || "",
          client_secret: this.client_secret || "",
          grant_type: "client_credentials",
        }).toString(),
      });

      this._accessToken = data.access_token;
      // 45 seconds before the token expires

      this._tokenExpiryTime =
        new Date().getTime() + (data.expires_in - 45) * 1000;
    } catch (e) {
      this._accessToken = null;
      this._tokenExpiryTime = 0;
      throw new HttpUnauthorizedError("Failed to get token");
    }
  };

  private isTokenExpired = () => {
    const now = new Date().getTime();
    return now > this._tokenExpiryTime;
  };

  private getToken = async () => {
    if (!this._accessToken || this.isTokenExpired()) {
      await this.newToken();
      if (!this._accessToken) {
        throw new HttpUnauthorizedError("Failed to refresh token");
      }
    }
    return this._accessToken;
  };

  public fetch = async <T>(
    route: string,
    config: IDefaultRequestConfig
  ): Promise<T> => {
    const token = await this.getToken();
    const url = `${process.env.D_ROLES_URL}${route}`;

    return httpClient<T>({
      url,
      timeout: constants.timeout.XL,
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
}

const rolesdataApiClient = new RolesDataAPIClient(
  process.env.D_ROLES_CLIENT_ID,
  process.env.D_ROLES_CLIENT_SECRET
);

export { rolesdataApiClient };
