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

const COOKIE_CONSERVATION_TIME = 30 * 60 * 1000;

interface IAuth {
  cookies: IInpiSiteCookies | null;
  lastSuccessfullAuth: number;
}
const authData: IAuth = {
  cookies: null,
  lastSuccessfullAuth: 0,
};

class InpiSiteAuthProvider {
  async getCookies(): Promise<string | null> {
    try {
      const cookiesNeedToBeUpdated =
        !!authData.cookies && this.verifyIfCookiesAreOutdated();

      // renew auth
      if (cookiesNeedToBeUpdated) {
        this.resetAuthData();
        await this.getInitialCookies();
        await this.authenticateCookies();
      }

      return this.formatCookies();
    } catch (e: any) {
      this.resetAuthData();
      logWarningInSentry('InpiSiteAuthProvider: returning empty credentials', {
        details: e.toString(),
      });
      return null;
    }
  }

  /**
   * First call. Caller get two session cookies and a token in the login form
   * */
  async getInitialCookies(): Promise<void> {
    const response = await httpGet(routes.rncs.portail.login, {
      headers: DEFAULT_HEADERS,
      timeout: INPI_SITE_IMEOUT,
    });
    const html = response.data;
    const sessionCookies = (response.headers['set-cookie'] || []).join('');
    authData.cookies = extractCookies(sessionCookies, html);
  }

  /**
   * POST the form to validate the cookies
   */
  async authenticateCookies() {
    const cookieString = this.formatCookies();
    const token = authData.cookies?.token;
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

    if (loginSuccess) {
      this.updateLastSuccessfullAuth();
    } else {
      throw new Error('INPI response does not contain success alert');
    }
  }

  verifyIfCookiesAreOutdated(): Boolean {
    if (authData.cookies) {
      return false;
    }

    const now = new Date().getTime();
    return now - authData.lastSuccessfullAuth > COOKIE_CONSERVATION_TIME;
  }

  formatCookies = () => {
    if (!authData.cookies) {
      return null;
    }
    return `PHPSESSID=${authData.cookies.phpSessionId}; Q71x4Drzmg@@=${authData.cookies.Q71}; cookieconsent_status=allow`;
  };

  resetAuthData() {
    authData.lastSuccessfullAuth = 0;
    authData.cookies = null;
  }

  updateLastSuccessfullAuth() {
    const now = new Date();
    authData.lastSuccessfullAuth = now.getTime();
  }
}

/**
 * Create a singleton
 */
const inpiSiteAuth = new InpiSiteAuthProvider();

export default inpiSiteAuth;
