import { IncomingMessage } from 'http';
import { GetServerSidePropsContext } from 'next';
import {
  IsLikelyASirenOrSiretException,
  NotASirenError,
  NotASiretError,
  NotLuhnValidSirenError,
  NotLuhnValidSiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '../models';
import {
  extractSirenFromSiretNoVerify,
  verifySiren,
  verifySiret,
} from '../utils/helpers/siren-and-siret';
import {
  redirectIfSiretOrSiren,
  redirectPageNotFound,
  redirectServerError,
  redirectSirenOrSiretIntrouvable,
  redirectSirenOrSiretInvalid,
} from '../utils/redirects';
import { ISession } from '../utils/session/accessSession';

export interface IPropsWithSession {
  session: ISession | null;
}

const getScope = (req: IncomingMessage | undefined, slug: string) => {
  let siren = null;
  let siret = null;
  let sirenAndSiret = {};

  try {
    siren = verifySiren(slug);
    sirenAndSiret = { siren };
  } catch {
    try {
      siret = verifySiret(slug);
      siren = extractSirenFromSiretNoVerify(siret || '');
      sirenAndSiret = { siret, siren };
    } catch {}
  }

  const headers = req ? req.headers : {};
  return req
    ? {
        ...sirenAndSiret,
        page: req.url,
        referer: headers.referer,
        browser: headers['user-agent'] as string,
      }
    : {};
};

export function withError(
  getServerSidePropsFunction: (context: GetServerSidePropsContext) => any
) {
  return async (context: GetServerSidePropsContext) => {
    try {
      return await getServerSidePropsFunction(context);
    } catch (exception: any) {
      const sirenOrSiret = exception.message;
      const scope = getScope(context.req, sirenOrSiret);

      if (exception instanceof IsLikelyASirenOrSiretException) {
        return redirectIfSiretOrSiren(sirenOrSiret);
      } else if (
        exception instanceof SirenNotFoundError ||
        exception instanceof SiretNotFoundError
      ) {
        return redirectSirenOrSiretIntrouvable(sirenOrSiret, scope);
      } else if (
        exception instanceof NotLuhnValidSirenError ||
        exception instanceof NotLuhnValidSiretError
      ) {
        return redirectSirenOrSiretInvalid(sirenOrSiret, scope);
      } else if (
        exception instanceof NotASirenError ||
        exception instanceof NotASiretError
      ) {
        return redirectPageNotFound(sirenOrSiret, scope);
      } else {
        return redirectServerError(sirenOrSiret, scope);
      }
    }
  };
}
