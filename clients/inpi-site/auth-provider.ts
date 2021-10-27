import routes from '../routes';
import httpClient from '../../utils/network/http';
import { logWarningInSentry } from '../../utils/sentry';
import {
  extractInitialAuthData,
  IInitialAuth,
  extractTokenFromHtmlForm,
  extractAuthSuccessFromHtmlForm,
  loginFormData,
} from './helpers';

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
  Referer: routes.rncs.portail.login,
  DNT: '1',
  Connection: 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  Pragma: 'no-cache',
  'Cache-Control': 'no-cache',
};

const INPI_SITE_IMEOUT = 30 * 1000;

const COOKIE_CONSERVATION_TIME = 30 * 60 * 1000;

interface IAuth {
  initialAuthData: IInitialAuth | null;
  lastSuccessfulAuthAt: number;
}
const authData: IAuth = {
  initialAuthData: null,
  lastSuccessfulAuthAt: 0,
};

class InpiSiteAuthProvider {
  async getAuthenticatedCookies(): Promise<string | null> {
    try {
      const now = new Date().getTime();
      const cookieIsTooOld =
        now - authData.lastSuccessfulAuthAt > COOKIE_CONSERVATION_TIME;

      // renew auth
      if (cookieIsTooOld) {
        this.resetAuthData();
        await this.getInitialAuthData();
        await this.authenticateCookie();
      }
      return this.getCookie();
    } catch (e: any) {
      this.resetAuthData();
      logWarningInSentry('InpiSiteAuthProvider: returning empty credentials', {
        details: e.toString(),
      });
      return null;
    }
  }

  /**
   * First call. Caller get two session cookies and a token to identify the login form
   * */
  async getInitialAuthData(): Promise<void> {
    const response = await httpClient({
      url: routes.rncs.portail.login,
      method: 'POST',
      headers: DEFAULT_HEADERS,
      timeout: INPI_SITE_IMEOUT,
    });
    const html = response.data;
    const cookies = (response.headers['set-cookie'] || []).join('');

    if (!cookies || typeof cookies !== 'string') {
      throw new Error('INPI response contains no set-cookie');
    } else {
      authData.initialAuthData = extractInitialAuthData(cookies);
      authData.initialAuthData.token = extractTokenFromHtmlForm(html);
    }
  }

  verifyAuthentication(): Boolean {
    return (
      authData.initialAuthData !== null &&
      !!authData.initialAuthData.token &&
      !!authData.initialAuthData.Q71 &&
      !!authData.initialAuthData.phpSessionId
    );
  }

  getCookie = () => {
    if (!this.verifyAuthentication()) {
      throw new Error();
    }
    return `PHPSESSID=${authData.initialAuthData?.phpSessionId}; Q71x4Drzmg@@=${authData.initialAuthData?.Q71}; cookieconsent_status=allow`;
  };

  /**
   * POST the form to validate the cookies
   */
  async authenticateCookie() {
    const cookie = this.getCookie();
    const token = authData.initialAuthData?.token;
    if (!cookie || !token) {
      throw new Error('trying to authenticate empty cookies or token');
    }

    const response = await httpClient({
      url: routes.rncs.portail.login,
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: 'https://data.inpi.fr',
        Cookie: this.getCookie(),
      },
      data: loginFormData(token),
      timeout: INPI_SITE_IMEOUT,
    });

    const html = response.data;
    const loginSuccess = extractAuthSuccessFromHtmlForm(html);

    if (loginSuccess) {
      this.updateLastSuccessfulAuthAt();
    } else {
      throw new Error('INPI response does not contains success alert');
    }
  }

  resetAuthData() {
    authData.lastSuccessfulAuthAt = 0;
    authData.initialAuthData = null;
  }

  updateLastSuccessfulAuthAt() {
    const now = new Date();
    authData.lastSuccessfulAuthAt = now.getTime();
  }
}

/**
 * Create a singleton
 */
const InpiSiteAuthInstance = new InpiSiteAuthProvider();

export default InpiSiteAuthInstance;
