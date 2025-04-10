import {
  HttpTooManyRequests,
  HttpUnauthorizedError,
} from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { Information } from '#models/exceptions';
import httpClient, { httpGet, IDefaultRequestConfig } from '#utils/network';
import { logWarningInSentry } from '#utils/sentry';

enum ECredentialType {
  DEFAULT,
  ACTES,
}

class RNEClient {
  private _token = '';
  private _currentAccountIndex = 0;
  private accounts;

  constructor(credentialType = ECredentialType.DEFAULT) {
    this.accounts =
      credentialType === ECredentialType.ACTES
        ? [
            [process.env.RNE_LOGIN_ACTES_1, process.env.RNE_PASSWORD_ACTES_1],
            [process.env.RNE_LOGIN_ACTES_2, process.env.RNE_PASSWORD_ACTES_2],
            [process.env.RNE_LOGIN_ACTES_3, process.env.RNE_PASSWORD_ACTES_3],
          ]
        : [[process.env.RNE_LOGIN, process.env.RNE_PASSWORD]];
  }

  refreshToken = async (shouldRotateAccount = false, e = {}) => {
    if (shouldRotateAccount) {
      this._currentAccountIndex =
        (this._currentAccountIndex + 1) % this.accounts.length;

      logWarningInSentry(
        new Information({
          name: 'Rotating RNE account',
          context: {
            details: `new pair : ${this._currentAccountIndex}, cause : ${e}`,
          },
        })
      );
    }

    const [username, password] = this.accounts[this._currentAccountIndex];

    const response = await httpClient<{ token: string }>({
      method: 'POST',
      url: routes.inpi.api.rne.login,
      data: {
        username,
        password,
      },
      timeout: constants.timeout.XXL,
      headers: {
        'Content-Type': 'application/json',
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
       *
       * In both case rotating account is safer
       */
      if (
        e instanceof HttpTooManyRequests ||
        e instanceof HttpUnauthorizedError
      ) {
        const shouldRotateAccount = true;
        this._token = await this.refreshToken(shouldRotateAccount, e);
        return await callback();
      } else {
        throw e;
      }
    }
  };
}

const actesApiRneClient = new RNEClient(ECredentialType.ACTES);

export { actesApiRneClient };
