import { HttpAuthentificationFailure } from '../exceptions';
import routes from '../routes';
import httpClient from '../../utils/network/http';
import { logWarningInSentry } from '../../utils/sentry';
import {
  extractInitialAuthData,
  IInitialAuth,
  extractTokenFromHtmlForm,
  extractAuthSuccessFromHtmlForm,
} from './inpi-site-parser';

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

const INPI_SITE_IMEOUT = 30000;

const COOKIE_CONSERVATION_TIME = 500000;

let initialAuthData: IInitialAuth | null = null;
let lastSuccessfulAuth: number = 0;
class InpiSiteAuthProvider {
  async getAuthenticatedCookies(): Promise<string | null> {
    try {
      const now = new Date().getTime();

      if (now - lastSuccessfulAuth > COOKIE_CONSERVATION_TIME) {
        const { isAlreadyAuthenticated } = await this.getInitialAuthData();

        if (!isAlreadyAuthenticated) {
          console.log('Authenticating');
          await this.authenticateCookie();
        } else {
          console.log('Already authenticated');
        }
      }

      return this.getCookie();
    } catch (e: any) {
      logWarningInSentry(
        'Inpi site authentication failed. Retourning empty credentials',
        { details: e.toString() }
      );
      return null;
    }
  }

  /**
   * First call. Caller get two session cookies and a token to identify the login form
   * */
  async getInitialAuthData(): Promise<{ isAlreadyAuthenticated: Boolean }> {
    try {
      const response = await httpClient({
        url: routes.rncs.portail.login,
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
          Cookie: this.getCookie(),
        },
        timeout: INPI_SITE_IMEOUT,
      });
      const html = response.data;

      if (html.indexOf('Bonjour Xavier') > -1) {
        return { isAlreadyAuthenticated: true };
      }

      const cookies = response.headers['set-cookie'].join('');

      if (!cookies || typeof cookies !== 'string') {
        throw new Error('Authentication failed');
      }

      initialAuthData = extractInitialAuthData(cookies);
      initialAuthData.token = extractTokenFromHtmlForm(html);
      return {
        isAlreadyAuthenticated: false,
      };
    } catch (e: any) {
      throw new HttpAuthentificationFailure(e);
    }
  }

  verifyAuthentication(): Boolean {
    return (
      initialAuthData !== null &&
      !!initialAuthData.token &&
      !!initialAuthData.Q71 &&
      !!initialAuthData.phpSessionId
    );
  }

  getCookie = () => {
    if (!this.verifyAuthentication()) {
      return null;
    }
    return `PHPSESSID=${initialAuthData?.phpSessionId}; Q71x4Drzmg@@=${initialAuthData?.Q71}; cookieconsent_status=allow`;
  };

  /**
   * POST the form to validate the cookies
   */
  async authenticateCookie() {
    try {
      const response = await httpClient({
        url: routes.rncs.portail.login,
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
          'Content-Type': 'application/x-www-form-urlencoded',
          Origin: 'https://data.inpi.fr',
          Cookie: this.getCookie(),
        },
        data: this.getFormData(),
        timeout: INPI_SITE_IMEOUT,
      });

      const html = response.data;

      const loginSuccess = extractAuthSuccessFromHtmlForm(html);

      if (loginSuccess) {
        const now = new Date();
        lastSuccessfulAuth = now.getTime();
      } else {
        lastSuccessfulAuth = 0;
        initialAuthData = null;
      }
    } catch (e: any) {
      lastSuccessfulAuth = 0;
      initialAuthData = null;
      throw new HttpAuthentificationFailure(e);
    }
  }

  getFormData = () => {
    const login = process.env.INPI_SITE_LOGIN as string;
    const password = process.env.INPI_SITE_PASSWORD as string;

    return `referer=&login_form%5BEmail%5D=${encodeURI(
      login
    )}&login_form%5Bpassword%5D=${encodeURI(
      password
    )}&login_form%5Blicence%5D=1&login_form%5Bsubmit%5D=&login_form%5B_token%5D=${
      initialAuthData?.token
    }`;
  };
}

/**
 * Create a singleton
 */
const InpiSiteAuthInstance = new InpiSiteAuthProvider();

export default InpiSiteAuthInstance;
