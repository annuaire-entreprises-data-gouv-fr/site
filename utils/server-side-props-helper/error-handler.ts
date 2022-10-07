import { IncomingMessage } from 'http';
import { GetServerSidePropsContext } from 'next';
import { HttpNotFound } from '../../clients/exceptions';
import {
  IsLikelyASirenOrSiretException,
  NotASirenError,
  NotASiretError,
  NotLuhnValidSirenError,
  NotLuhnValidSiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '../../models';
import {
  extractSirenFromSiretNoVerify,
  verifySiren,
  verifySiret,
} from '../helpers/siren-and-siret';
import {
  redirectIfSiretOrSiren,
  redirectPageNotFound,
  redirectServerError,
  redirectSirenOrSiretIntrouvable,
  redirectSirenOrSiretInvalid,
} from './redirects';

const handleExceptions = (exception: any, req: IncomingMessage | undefined) => {
  try {
    const message = exception.message;
    const scope = getScope(req, message);

    if (exception instanceof IsLikelyASirenOrSiretException) {
      return redirectIfSiretOrSiren(message);
    } else if (
      exception instanceof SirenNotFoundError ||
      exception instanceof SiretNotFoundError
    ) {
      return redirectSirenOrSiretIntrouvable(message, scope);
    } else if (
      exception instanceof NotLuhnValidSirenError ||
      exception instanceof NotLuhnValidSiretError
    ) {
      return redirectSirenOrSiretInvalid(message, scope);
    } else if (
      exception instanceof NotASirenError ||
      exception instanceof NotASiretError
    ) {
      return redirectPageNotFound(message, scope);
    } else if (exception instanceof HttpNotFound) {
      return redirectPageNotFound(message, scope);
    } else {
      return redirectServerError(message, scope);
    }
  } catch (e: any) {
    console.log('=== Error-handler failed to handle exception ===');
    console.log(exception);
    console.log(e);
    return redirectServerError('Error-handler failed to handle exception', {});
  }
};

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

  const headers = req && req.headers ? req.headers : {};
  return req
    ? {
        ...sirenAndSiret,
        page: req.url,
        referer: headers['referer'],
        browser: headers['user-agent'] as string,
      }
    : {};
};

/**
 * Handle exceptions raised in getServersSideProps
 *
 * @param getServerSidePropsFunction
 * @returns
 */
export function handleErrorFromServerSideProps(
  getServerSidePropsFunction: (context: GetServerSidePropsContext) => any
) {
  return async (context: GetServerSidePropsContext) => {
    try {
      return await getServerSidePropsFunction(context);
    } catch (exception: any) {
      return handleExceptions(exception, context.req);
    }
  };
}
