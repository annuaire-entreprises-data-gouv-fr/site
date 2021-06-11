import { NextApiRequest, NextApiResponse } from 'next';
import {
  HttpAuthentificationFailure,
  HttpNotFound,
} from '../../../clients/exceptions';
import routes from '../../../clients/routes';
import { isSiren } from '../../../utils/helpers/siren-and-siret';
import { fetchWithTimeout } from '../../../utils/network/fetch-with-timeout';
import logErrorInSentry, { logWarningInSentry } from '../../../utils/sentry';

/**
 * Call with authenticated cookies to get full pdf.
 */
const proxyPdf = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  const siren = slug as string;

  if (!isSiren(siren)) {
    throw new HttpNotFound(404, `${siren} is not a valid siren`);
  }

  try {
    const initialAuthData = await getInitialAuthData();
    const authenticationStatus = await authenticateCookie(initialAuthData);

    if (authenticationStatus !== 200) {
      logWarningInSentry(
        'Authentication failed while downloading PDF, fallback on regular PDF'
      );
    }

    const response = await fetchWithTimeout(
      `${routes.rncs.portail.entreprise}${siren}?format=pdf`,
      {
        headers: {
          Cookie: getCookie(initialAuthData),
        },
      }
    );

    const pdfRaw = response.body;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=justificatif_immatriculation_rcs_${siren}.pdf`
    );

    res.status(200).send(pdfRaw);
  } catch (e) {
    console.log(e);
    logErrorInSentry(e);
    res.status(500).json({ message: e });
  }
};

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

const getCookie = (initialAuthData: IInitialAuth) =>
  `PHPSESSID=${initialAuthData.phpSessionId}; Q71x4Drzmg@@=${initialAuthData.Q71}; cookieconsent_status=allow`;

const getFormData = (initialAuthData: IInitialAuth) => {
  const login = process.env.INPI_SITE_LOGIN as string;
  const password = process.env.INPI_SITE_PASSWORD as string;

  return `referer=&login_form%5BEmail%5D=${encodeURI(
    login
  )}&login_form%5Bpassword%5D=${encodeURI(
    password
  )}&login_form%5Blicence%5D=1&login_form%5Bsubmit%5D=&login_form%5B_token%5D=${
    initialAuthData.token
  }`;
};

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

/** First call. Caller get two session cookies and a token to identify the login form */
const getInitialAuthData = async (): Promise<IInitialAuth> => {
  try {
    const response = await fetchWithTimeout(routes.rncs.portail.login, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
    });

    const cookies = response.headers.get('set-cookie');

    if (!cookies || typeof cookies !== 'string') {
      throw new Error('Authentication failed');
    }

    const initialAuthData = extractInitialAuthData(cookies);

    const html = await response.text();
    initialAuthData.token = extractTokenFromHtmlForm(html);

    if (
      !initialAuthData.token ||
      !initialAuthData.Q71 ||
      !initialAuthData.phpSessionId
    ) {
      throw new Error('Authentication failed');
    }
    return initialAuthData;
  } catch (e) {
    throw new HttpAuthentificationFailure(e);
  }
};

/**
 * POST the form to validate the cookies
 */
const authenticateCookie = async (initialAuthData: IInitialAuth) => {
  try {
    const response = await fetchWithTimeout(routes.rncs.portail.login, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: 'https://data.inpi.fr',
        Cookie: getCookie(initialAuthData),
      },
      body: getFormData(initialAuthData),
    });

    const html = await response.text();
    const loginSuccess = extractAuthSuccessFromHtmlForm(html);

    return loginSuccess ? 200 : 403;
  } catch (e) {
    throw new HttpAuthentificationFailure(e);
  }
};

export default proxyPdf;
