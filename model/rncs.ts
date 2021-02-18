import logErrorInSentry from '../utils/sentry';
import routes from './routes';

const rncsAuth = async () => {
  const login = process.env.INPI_LOGIN as string;
  const password = process.env.INPI_PASSWORD as string;

  const response = await fetch(routes.rncs.api.login, {
    method: 'POST',
    headers: {
      login: login,
      password: password,
    },
  });
  const cookie = response.headers.get('set-cookie');
  if (cookie && typeof cookie === 'string') {
    return cookie.split(';')[0];
  }
  return undefined;
};

export const getRNCSLink = async (siren: string) => {
  try {
    const cookie = await rncsAuth();
    if (!cookie) {
      return null;
    }

    const response = await fetch(routes.rncs.api.imr + siren, {
      headers: { Cookie: cookie },
    });

    const result = await response.json();
    return result.length > 0 ? routes.rncs.portail + siren : null;
  } catch (e) {
    logErrorInSentry(`API RNCS for ${siren} : ${e}`);
    return null;
  }
};
