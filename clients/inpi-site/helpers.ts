//=================
//  PARSING METHODS
//=================

export interface IInitialAuth {
  phpSessionId: string;
  Q71: string;
  token: string;
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

const loginFormData = (token: string) => {
  const login = process.env.INPI_SITE_LOGIN as string;
  const password = process.env.INPI_SITE_PASSWORD as string;

  return `referer=&login_form%5BEmail%5D=${encodeURI(
    login
  )}&login_form%5Bpassword%5D=${encodeURI(
    password
  )}&login_form%5Blicence%5D=1&login_form%5Bsubmit%5D=&login_form%5B_token%5D=${token}`;
};

export {
  extractAuthSuccessFromHtmlForm,
  extractTokenFromHtmlForm,
  extractInitialAuthData,
  loginFormData,
};
