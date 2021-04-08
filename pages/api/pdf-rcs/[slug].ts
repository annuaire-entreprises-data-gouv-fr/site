import { NextApiRequest, NextApiResponse } from 'next';
import { stringify } from 'node:querystring';
import {
  HttpAuthentificationFailure,
  HttpNotFound,
} from '../../../clients/exceptions';
import { isSirenOrSiret } from '../../../utils/helpers/siren-and-siret';
import { fetchWithTimeout } from '../../../utils/network/fetch-with-timeout';
import logErrorInSentry from '../../../utils/sentry';

interface initialAuth {
  phpSessionId: string;
  Q71: string;
  token: string;
}

/** First call. Caller get two session cookies and a token to identify the login form */
const getInitialAuthData = async (): Promise<initialAuth> => {
  try {
    const response = await fetchWithTimeout('https://data.inpi.fr/login', {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        Referer: 'https://data.inpi.fr/login',
        DNT: '1',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
    });

    const cookies = response.headers.get('set-cookie');
    if (!cookies || typeof cookies !== 'string') {
      throw new Error('Authentication failed');
    }

    const initialAuthData = {} as initialAuth;
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

    const html = await response.text();
    const formSearch = RegExp(
      /(name="login_form\[_token\]" value="[^"]*)/,
      'g'
    );
    const formSearchResults = formSearch.exec(html);

    if (!formSearchResults) {
      throw new Error('Authentication failed');
    }

    initialAuthData.token = formSearchResults[0].replace(
      'name="login_form[_token]" value="',
      ''
    );

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
const authenticateCookie = async (initialAuthData: initialAuth) => {
  try {
    const login = process.env.INPI_LOGIN as string;
    const password = process.env.INPI_PASSWORD as string;

    const response = await fetchWithTimeout('https://data.inpi.fr/login', {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        Referer: 'https://data.inpi.fr/login',
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: 'https://data.inpi.fr',
        DNT: '1',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Cookie: `PHPSESSID=${initialAuthData.phpSessionId}; Q71x4Drzmg@@=${initialAuthData.Q71}; cookieconsent_status=allow`,
      },
      body: `referer=&login_form%5BEmail%5D=${encodeURI(
        login
      )}&login_form%5Bpassword%5D=${encodeURI(
        password
      )}&login_form%5Blicence%5D=1&login_form%5Bsubmit%5D=&login_form%5B_token%5D=${
        initialAuthData.token
      }`,
    });

    const status = response.status;
    return status;
  } catch (e) {
    throw new HttpAuthentificationFailure(e);
  }
};

/**
 * Call with authenticated cookies to get full pdf.
 */
const proxyPdf = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  const siren = slug as string;

  if (!isSirenOrSiret(siren)) {
    throw new HttpNotFound(404, `${siren} is not a valid siren`);
  }

  try {
    const initialAuthData = await getInitialAuthData();
    await authenticateCookie(initialAuthData);
    const response = await fetchWithTimeout(
      `https://data.inpi.fr/entreprises/${siren}?format=pdf`,
      {
        headers: {
          Cookie: `PHPSESSID=${initialAuthData.phpSessionId}; Q71x4Drzmg@@=${initialAuthData.Q71}; cookieconsent_status=allow`,
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

export default proxyPdf;
