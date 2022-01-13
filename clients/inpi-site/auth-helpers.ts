export interface IInpiSiteCookies {
  phpSessionId: string;
  Q71: string;
}

const extractCookies = (sessionCookies: any): IInpiSiteCookies => {
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

  if (Q71 === null || phpSessionId === null) {
    throw new Error('Could not parse session cookies');
  }

  return {
    phpSessionId,
    Q71,
  };
};

const extractAuthSuccessFromHtmlForm = (html: string) => {
  return html.indexOf('alert-success alert-dismissible') > -1;
};

const loginFormData = () => {
  const login = process.env.INPI_SITE_LOGIN as string;
  const password = process.env.INPI_SITE_PASSWORD as string;

  return `referer=https%3A%2F%2Fdata.inpi.fr%2Flogin&login_form%5BEmail%5D=${login}&login_form%5Bpassword%5D=${password}&login_form%5Blicence%5D=1&login_form%5Bsubmit%5D=`;
};

export { extractAuthSuccessFromHtmlForm, extractCookies, loginFormData };
