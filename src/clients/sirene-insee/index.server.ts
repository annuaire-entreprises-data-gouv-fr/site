import { URLSearchParams } from "node:url";
import { createServerOnlyFn } from "@tanstack/react-start";
import { HttpServerError, HttpUnauthorizedError } from "#/clients/exceptions";
import routes from "#/clients/routes";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import constants from "#/models/constants";
import { Information } from "#/models/exceptions";
import httpClient, {
  httpGet,
  httpPost,
  type IDefaultRequestConfig,
} from "#/utils/network";
import { logInfoInSentry } from "#/utils/sentry";
import getSession from "#/utils/server-side-helper/get-session";

interface IAccessToken {
  data: {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: "Bearer" | string;
  };
  tokenExpiryTime: number;
}

class HttpInseeAccountUnavailableError extends HttpUnauthorizedError {
  constructor() {
    super("ACCOUNT_UNAVAILABLE");
  }
}

export class HttpInseeClient {
  private _token: IAccessToken | null;
  private readonly token_url: string;
  private readonly credentials: {
    client_id: string | undefined;
    client_secret: string | undefined;
    username: string | undefined;
    password: string | undefined;
  };
  private readonly fallbackClient?: HttpInseeClient;
  private _forceFallbackUntil: Date | null = null;
  private _newTokenPromise: Promise<void> | null = null;

  constructor(
    token_url: string,
    credentials: {
      client_id: string | undefined;
      client_secret: string | undefined;
      username: string | undefined;
      password: string | undefined;
    },
    fallbackClient?: HttpInseeClient
  ) {
    this.token_url = token_url;
    this.credentials = credentials;
    this.fallbackClient = fallbackClient;

    if (
      !(
        this.credentials.client_id &&
        this.credentials.client_secret &&
        this.token_url &&
        this.credentials.username &&
        this.credentials.password
      ) &&
      process.env.NODE_ENV === "production"
    ) {
      throw new HttpServerError("An insee env variable is undefined");
    }
    this._token = null;
  }

  newToken = async () => {
    let resolvePromise: () => void = () => undefined;
    this._newTokenPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    try {
      const data = await httpClient<IAccessToken["data"]>({
        url: this.token_url,
        method: "POST",
        timeout: constants.timeout.XXS,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: new URLSearchParams({
          client_id: this.credentials.client_id || "",
          client_secret: this.credentials.client_secret || "",
          grant_type: "password",
          validity_period: "604800",
          username: this.credentials.username || "",
          password: this.credentials.password || "",
        }).toString(),
      });
      this._token = {
        data,
        tokenExpiryTime: Date.now() + data.expires_in * 1000,
      };
    } catch {
      this._token = null;
    } finally {
      resolvePromise();
      this._newTokenPromise = null;
    }
  };

  isTokenExpired = () => {
    const now = Date.now();
    const tokenExpiryTime = this._token ? this._token.tokenExpiryTime : 0;
    return now > tokenExpiryTime;
  };

  getToken = async () => {
    // in case something went wrong during the last refresh
    if (!this._token || this.isTokenExpired()) {
      logInfoInSentry(
        new Information({
          name: "RefreshingInseeToken",
          message: "Refreshing Insee token",
        })
      );

      if (this._newTokenPromise) {
        await this._newTokenPromise;
      } else {
        // newToken sets _newTokenPromise synchronously before the first await
        await this.newToken();
      }

      if (!this._token) {
        throw new HttpInseeAccountUnavailableError();
      }
    }
    return this._token;
  };

  get = async <T>(
    url: string,
    config: IDefaultRequestConfig,
    useFallback = false
  ): Promise<T> => {
    if (
      this.fallbackClient &&
      (useFallback ||
        (this._forceFallbackUntil && this._forceFallbackUntil > new Date()))
    ) {
      return this.fallbackClient?.get(url, config);
    }

    try {
      const token = await this.getToken();

      return httpGet(url, {
        timeout: constants.timeout.M,
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token.data.access_token}`,
        },
      });
    } catch (error) {
      if (
        error instanceof HttpInseeAccountUnavailableError &&
        this.fallbackClient
      ) {
        this._forceFallbackUntil = oneHourFromNow();
        return this.fallbackClient.get(url, config);
      }
      throw error;
    }
  };

  post = async <T>(
    url: string,
    config: IDefaultRequestConfig,
    useFallback = false
  ): Promise<T> => {
    if (
      this.fallbackClient &&
      (useFallback ||
        (this._forceFallbackUntil && this._forceFallbackUntil > new Date()))
    ) {
      return this.fallbackClient?.post(url, config);
    }

    try {
      const token = await this.getToken();

      return httpPost(url, {
        timeout: constants.timeout.M,
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token.data.access_token}`,
        },
      });
    } catch (error) {
      if (
        error instanceof HttpInseeAccountUnavailableError &&
        this.fallbackClient
      ) {
        this._forceFallbackUntil = oneHourFromNow();
        return this.fallbackClient.post(url, config);
      }
      throw error;
    }
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

// Insee client used as a fallback in case public or agent calls fail
const grandPublicFallbackClient = new HttpInseeClient(routes.sireneInsee.auth, {
  client_id: process.env.INSEE_GRAND_PUBLIC_FALLBACK_CLIENT_ID,
  client_secret: process.env.INSEE_GRAND_PUBLIC_FALLBACK_CLIENT_SECRET,
  username: process.env.INSEE_GRAND_PUBLIC_FALLBACK_USERNAME,
  password: process.env.INSEE_GRAND_PUBLIC_FALLBACK_PASSWORD,
});

// Insee client used for public calls, will fallback to fallbackClient on failure
const grandPublicClient = new HttpInseeClient(
  routes.sireneInsee.auth,
  {
    client_id: process.env.INSEE_GRAND_PUBLIC_MAIN_CLIENT_ID,
    client_secret: process.env.INSEE_GRAND_PUBLIC_MAIN_CLIENT_SECRET,
    username: process.env.INSEE_GRAND_PUBLIC_MAIN_USERNAME,
    password: process.env.INSEE_GRAND_PUBLIC_MAIN_PASSWORD,
  },
  grandPublicFallbackClient
);

// Insee client used as a fallback in case export csv calls fail
const exportCsvFallbackClient = new HttpInseeClient(routes.sireneInsee.auth, {
  client_id: process.env.INSEE_EXPORT_SIRENE_FALLBACK_CLIENT_ID,
  client_secret: process.env.INSEE_EXPORT_SIRENE_FALLBACK_CLIENT_SECRET,
  username: process.env.INSEE_EXPORT_SIRENE_FALLBACK_USERNAME,
  password: process.env.INSEE_EXPORT_SIRENE_FALLBACK_PASSWORD,
});

// Insee client used for export csv calls
const exportCsvClient = new HttpInseeClient(
  routes.sireneInsee.auth,
  {
    client_id: process.env.INSEE_EXPORT_SIRENE_MAIN_CLIENT_ID,
    client_secret: process.env.INSEE_EXPORT_SIRENE_MAIN_CLIENT_SECRET,
    username: process.env.INSEE_EXPORT_SIRENE_MAIN_USERNAME,
    password: process.env.INSEE_EXPORT_SIRENE_MAIN_PASSWORD,
  },
  exportCsvFallbackClient
);

// Insee client used as a fallback in case agent calls fail
const agentsFallbackClient = new HttpInseeClient(routes.sireneInsee.auth, {
  client_id: process.env.INSEE_ESPACE_AGENT_FALLBACK_CLIENT_ID,
  client_secret: process.env.INSEE_ESPACE_AGENT_FALLBACK_CLIENT_SECRET,
  username: process.env.INSEE_ESPACE_AGENT_FALLBACK_USERNAME,
  password: process.env.INSEE_ESPACE_AGENT_FALLBACK_PASSWORD,
});

// Insee client used for agent calls, will fallback to fallbackClient on failure
const agentsClient = new HttpInseeClient(
  routes.sireneInsee.auth,
  {
    client_id: process.env.INSEE_ESPACE_AGENT_MAIN_CLIENT_ID,
    client_secret: process.env.INSEE_ESPACE_AGENT_MAIN_CLIENT_SECRET,
    username: process.env.INSEE_ESPACE_AGENT_MAIN_USERNAME,
    password: process.env.INSEE_ESPACE_AGENT_MAIN_PASSWORD,
  },
  agentsFallbackClient
);

function oneHourFromNow() {
  return new Date(Date.now() + 1000 * 60 * 60);
}

export const inseeAgentsClientGet = createServerOnlyFn(
  async <T>(
    route: string,
    config: IDefaultRequestConfig = {},
    useFallback = false
  ): Promise<T> =>
    (await agentsClient.get(
      route,
      {
        timeout: constants.timeout.S,
        ...config,
      },
      useFallback
    )) as T
);

/**
 * Insee API client
 *
 * @param route
 * @param config
 * @param useFallback use fallback credentials
 * @returns
 */
export const inseeClientGet = createServerOnlyFn(
  async <T>(
    route: string,
    config: IDefaultRequestConfig = {},
    useFallback = false
  ): Promise<T> => {
    const session = await getSession();

    if (hasRights(session, ApplicationRights.isAgent)) {
      return inseeAgentsClientGet(route, config, useFallback);
    }

    return (await grandPublicClient.get(
      route,
      {
        timeout: constants.timeout.S,
        ...config,
      },
      useFallback
    )) as T;
  }
);

/**
 * Insee API export csvclient POST
 *
 * @param route
 * @param config
 * @returns
 */
export const exportCsvClientPost = createServerOnlyFn(
  async <T>(route: string, config: IDefaultRequestConfig = {}): Promise<T> =>
    (await exportCsvClient.post(route, {
      timeout: constants.timeout.XXXL,
      ...config,
    })) as T
);
