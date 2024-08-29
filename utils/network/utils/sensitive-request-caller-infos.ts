import { HttpUnauthorizedError } from '#clients/exceptions';
import getSession from '#utils/server-side-helper/app/get-session';
import { ISensitiveCaller } from './sensitive-request-logger';

export async function sensitiveRequestCallerInfos(): Promise<ISensitiveCaller> {
  const session = await getSession();

  if (session?.user) {
    const { email, siret = null, scopes = [], useCase } = session.user;

    if (!email) {
      throw new HttpUnauthorizedError('Sensitive requests require an email');
    }

    const domain = (email.match(/@(.*)/) || ['']).shift() || '';

    return {
      email,
      siret,
      scopes,
      useCase,
      domain,
    };
  }
  throw new HttpUnauthorizedError(
    'Sensitive requests require an authenticated user'
  );
}
