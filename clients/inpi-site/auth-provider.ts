import routes from '../routes';
import httpClient, { httpGet } from '../../utils/network/http';
import { logWarningInSentry } from '../../utils/sentry';
import {
  extractCookies,
  IInpiSiteCookies,
  extractAuthSuccessFromHtmlForm,
  loginFormData,
} from './auth-helpers';

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

const COOKIE_VALIDITY_TIME = 45 * 60 * 1000;
const COOKIE_OUTDATED_RETRY_TIME = 10 * 60 * 1000;

interface IAuth {
  cookies: IInpiSiteCookies | null;
  lastSuccessfullAuth: number;
}
const authData: IAuth = {
  cookies: null,
  lastSuccessfullAuth: 0,
};

class InpiSiteAuthProvider {
  _initialized = false;

  async init() {
    this._initialized = true;
    await this.refreshCookies();
  }

  async getCookies() {
    if (!this._initialized) {
      await this.init();
    }
    return authData.cookies ? this.formatCookies(authData.cookies) : null;
  }

  async refreshCookies(): Promise<void> {
    try {
      const newCookies = await this.getInitialCookies();
      await this.authenticateCookies(newCookies);
      this.setCookies(newCookies);
      setTimeout(this.refreshCookies, COOKIE_VALIDITY_TIME);
    } catch (e: any) {
      logWarningInSentry('InpiSiteAuthProvider: cookie refresh failed', {
        details: e.toString(),
      });
      setTimeout(this.refreshCookies, COOKIE_OUTDATED_RETRY_TIME);
    }
  }

  /**
   * First call. Caller get two session cookies and a token in the login form
   * */
  async getInitialCookies(): Promise<IInpiSiteCookies> {
    const response = await httpGet(routes.rncs.portail.login, {
      headers: DEFAULT_HEADERS,
      timeout: INPI_SITE_IMEOUT,
    });
    const html = response.data;
    const sessionCookies = (response.headers['set-cookie'] || []).join('');

    return extractCookies(sessionCookies, html);
  }

  /**
   * POST the form to validate the cookies
   */
  async authenticateCookies(cookies: IInpiSiteCookies) {
    const cookieString = this.formatCookies(cookies);
    const token = cookies.token;
    if (!cookieString || !token) {
      throw new Error('trying to authenticate empty cookies or token');
    }

    const response = await httpClient({
      url: routes.rncs.portail.login,
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: 'https://data.inpi.fr',
        Cookie: cookieString,
      },
      data: loginFormData(token),
      timeout: INPI_SITE_IMEOUT,
    });

    const html = response.data;
    const loginSuccess = extractAuthSuccessFromHtmlForm(html);

    if (!loginSuccess) {
      throw new Error('INPI response does not contain success alert');
    }
  }

  formatCookies = (cookies: IInpiSiteCookies) => {
    if (!cookies) {
      return null;
    }
    return `PHPSESSID=${cookies.phpSessionId}; Q71x4Drzmg@@=${cookies.Q71}; cookieconsent_status=allow`;
  };

  setCookies(newCookies: IInpiSiteCookies) {
    authData.lastSuccessfullAuth = new Date().getTime();
    authData.cookies = newCookies;
  }
}

/**
 * Create a singleton
 */
const inpiSiteAuth = new InpiSiteAuthProvider();

export default inpiSiteAuth;
