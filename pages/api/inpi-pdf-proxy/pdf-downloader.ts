import { HttpAuthentificationFailure } from '../../../clients/exceptions';
import routes from '../../../clients/routes';
import { Siren } from '../../../utils/helpers/siren-and-siret';
import httpClient, { httpGet } from '../../../utils/network/http';
import { logWarningInSentry } from '../../../utils/sentry';

//=================
//    Auth methods
//=================

interface IInitialAuth {
  phpSessionId: string;
  Q71: string;
  token: string;
}

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

/**
 * INPI API can be very slow
 */
const INPI_TIMEOUT = 20000;

class PDFDownloader {
  initialAuthData: IInitialAuth | null = null;

  constructor() {}

  async startDownload(siren: Siren) {
    await this.authenticate();

    return;
    if (!this.verifyAuthentication()) {
      logWarningInSentry(
        'Authentication failed while downloading PDF, fallback on regular PDF'
      );
    }

    const response = await httpGet(
      `${routes.rncs.portail.entreprise}${siren}?format=pdf`,
      {
        headers: {
          Cookie: this.getCookie(),
        },
        responseType: 'arraybuffer',
        timeout: INPI_TIMEOUT * 2,
      }
    );

    return response;
  }

  async authenticate(): Promise<void> {
    const { isAlreadyAuthenticated } = await this.getInitialAuthData();

    console.log(isAlreadyAuthenticated);
    if (!isAlreadyAuthenticated) {
      await this.authenticateCookie();
    }
    console.log('Authenticated');
  }

  /**
   * First call. Caller get two session cookies and a token to identify the login form
   * */
  async getInitialAuthData(): Promise<{ isAlreadyAuthenticated: Boolean }> {
    try {
      const response = await httpClient({
        url: routes.rncs.portail.informations,
        method: 'POST',
        headers: DEFAULT_HEADERS,
        timeout: INPI_TIMEOUT,
      });
      const isRedirected = response.request.path.indexOf('redirectUrl') > -1;

      if (!isRedirected) {
        return { isAlreadyAuthenticated: true };
      }

      const cookies = response.headers['set-cookie'].join('');

      if (!cookies || typeof cookies !== 'string') {
        throw new Error('Authentication failed');
      }
      const html = response.data;

      this.initialAuthData = extractInitialAuthData(cookies);
      this.initialAuthData.token = extractTokenFromHtmlForm(html);
      return {
        isAlreadyAuthenticated: !isRedirected && !!this.initialAuthData.token,
      };
    } catch (e: any) {
      throw new HttpAuthentificationFailure(e);
    }
  }

  verifyAuthentication(): Boolean {
    return (
      this.initialAuthData !== null &&
      !!this.initialAuthData.token &&
      !!this.initialAuthData.Q71 &&
      !!this.initialAuthData.phpSessionId
    );
  }

  getCookie = () => {
    if (
      !this.initialAuthData ||
      !this.initialAuthData.phpSessionId ||
      !this.initialAuthData.Q71
    ) {
      return '';
    }
    return `PHPSESSID=${this.initialAuthData.phpSessionId}; Q71x4Drzmg@@=${this.initialAuthData.Q71}; cookieconsent_status=allow`;
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
        timeout: INPI_TIMEOUT,
      });

      const html = response.data;

      const loginSuccess = extractAuthSuccessFromHtmlForm(html);

      return loginSuccess ? 200 : 403;
    } catch (e: any) {
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
      this.initialAuthData && this.initialAuthData.token
    }`;
  };
}

const extractInitialAuthData = (cookies: string) => {
  const initialAuthData = {} as IInitialAuth;
  const cookieSearch = RegExp(/(PHPSESSID=[^;]*|Q71x4Drzmg@@=[^;]*)/, 'g');
  let cookieSearchResult = cookieSearch.exec(cookies);

  while (cookieSearchResult !== null) {
    const match = cookieSearchResult[0];
    if (match.indexOf('PHPSESSID=') > -1) {
      initialAuthData.phpSessionId = match.replace('PHPSESSID=', '');
    } else if (match.indexOf('Q71x4Drzmg@@=') > -1) {
      initialAuthData.Q71 = match.replace('Q71x4Drzmg@@=', '');
    }
    cookieSearchResult = cookieSearch.exec(cookies);
  }

  return initialAuthData;
};

const extractTokenFromHtmlForm = (html: string) => {
  const formSearch = RegExp(/(name="login_form\[_token\]" value="[^"]*)/, 'g');
  const formSearchResults = formSearch.exec(html);

  if (!formSearchResults) {
    throw new Error('Authentication failed');
  }

  return formSearchResults[0].replace('name="login_form[_token]" value="', '');
};

const extractAuthSuccessFromHtmlForm = (html: string) => {
  return html.indexOf('alert-success alert-dismissible') > -1;
};

export default PDFDownloader;
