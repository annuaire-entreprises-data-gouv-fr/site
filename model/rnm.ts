import logErrorInSentry from '../utils/sentry';
import routes from './routes';

export const getRNMLink = async (siren: string) => {
  try {
    const response = await fetch(routes.rnm + siren + '?format=json');
    return response.status === 200 ? routes.rnm + siren : null;
  } catch (e) {
    console.log(e);
    logErrorInSentry(e);
    return null;
  }
};
