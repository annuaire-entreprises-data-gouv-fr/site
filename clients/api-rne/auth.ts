import {
  HttpTooManyRequests,
  HttpUnauthorizedError,
} from "#clients/exceptions";
import routes from "#clients/routes";
import constants from "#models/constants";
import httpClient, { httpGet, IDefaultRequestConfig } from "#utils/network";

class RNEClient {
  private _token = "";
  private account = [
    process.env.RNE_LOGIN_ACTES_1,
    process.env.RNE_PASSWORD_ACTES_1,
  ];

  refreshToken = async () => {
    const [username, password] = this.account;

    const response = await httpClient<{ token: string }>({
      method: "POST",
      url: routes.inpi.api.rne.login,
      data: {
        username,
        password,
      },
      timeout: constants.timeout.XXL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.token;
  };

  get = async <T>(
    route: string,
    options?: IDefaultRequestConfig
  ): Promise<T> => {
    const callback = () =>
      httpGet<T>(route, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${this._token}`,
        },
      });

    try {
      if (!this._token) {
        this._token = await this.refreshToken();
      }
      return await callback();
    } catch (e: any) {
      /**
       * Either INPI returns too many requests or unauthorized
       *
       * Unauthorized can either be
       * - token needs to be refresh
       * - account is blocked
       */
      if (
        e instanceof HttpTooManyRequests ||
        e instanceof HttpUnauthorizedError
      ) {
        this._token = await this.refreshToken();
        return await callback();
      } else {
        throw e;
      }
    }
  };
}

const actesApiRneClient = new RNEClient();

export { actesApiRneClient };
