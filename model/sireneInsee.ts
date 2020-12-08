import logErrorInSentry from '../utils/sentry';
import routes from './routes';

const inseeAuth = async () => {
  const clientId = process.env.INSEE_CLIENT_ID;
  const clientSecret = process.env.INSEE_CLIENT_SECRET;
  const response = await fetch('https://api.insee.fr/token', {
    method: 'POST',
    body:
      'grant_type=client_credentials&client_id=' +
      clientId +
      '&client_secret=' +
      clientSecret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.json();
};

export const getUniteLegaleInsee = async (siren: string) => {
  try {
    const token = await inseeAuth();

    // Return a second API call
    // This one uses the token we received for authentication
    const response = await fetch(routes.inseeSiren + siren, {
      headers: {
        Authorization: token.token_type + ' ' + token.access_token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 429) {
      throw new Error('Too many requests');
    }

    const uniteLegale = await response.json();

    if (response.status === 403) {
      return { siren, statut_diffusion: 'N' };
    } else {
      return uniteLegale;
    }
  } catch (e) {
    console.log(e);
    logErrorInSentry(e);
    return undefined;
  }
};
