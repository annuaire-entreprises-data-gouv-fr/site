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

export {
  extractAuthSuccessFromHtmlForm,
  extractTokenFromHtmlForm,
  extractInitialAuthData,
};
