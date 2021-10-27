export interface IInpiSiteCookies {
  phpSessionId: string;
  Q71: string;
  token: string;
}

const extractCookies = (
  sessionCookies: any,
  html: string
): IInpiSiteCookies => {
  if (!sessionCookies || typeof sessionCookies !== 'string') {
    throw new Error('Invalid session cookies');
  }

  const cookieSearch = RegExp(/(PHPSESSID=[^;]*|Q71x4Drzmg@@=[^;]*)/, 'g');
  let cookieSearchResult = cookieSearch.exec(sessionCookies);

  let Q71 = null;
  let phpSessionId = null;

  while (cookieSearchResult !== null) {
    const match = cookieSearchResult[0];
    if (match.indexOf('PHPSESSID=') > -1) {
      phpSessionId = match.replace('PHPSESSID=', '');
    } else if (match.indexOf('Q71x4Drzmg@@=') > -1) {
      Q71 = match.replace('Q71x4Drzmg@@=', '');
    }
    cookieSearchResult = cookieSearch.exec(sessionCookies);
  }

  const token = extractTokenFromHtmlForm(html);

  if (Q71 === null || phpSessionId === null || token === null) {
    throw new Error('Could not parse session cookies');
  }

  return {
    phpSessionId,
    Q71,
    token,
  };
};

const extractTokenFromHtmlForm = (html: string) => {
  const formSearch = RegExp(/(name="login_form\[_token\]" value="[^"]*)/, 'g');
  const formSearchResults = formSearch.exec(html);

  if (formSearchResults && formSearchResults.length > 0) {
    const token = formSearchResults[0].replace(
      'name="login_form[_token]" value="',
      ''
    );

    if (token) {
      return token;
    }
  }

  return null;
};

const extractAuthSuccessFromHtmlForm = (html: string) => {
  return html.indexOf('alert-success alert-dismissible') > -1;
};

const loginFormData = (token: string) => {
  const login = process.env.INPI_SITE_LOGIN as string;
  const password = process.env.INPI_SITE_PASSWORD as string;

  return `referer=&login_form%5BEmail%5D=${encodeURI(
    login
  )}&login_form%5Bpassword%5D=${encodeURI(
    password
  )}&login_form%5Blicence%5D=1&login_form%5Bsubmit%5D=&login_form%5B_token%5D=${token}`;
};

export { extractAuthSuccessFromHtmlForm, extractCookies, loginFormData };
