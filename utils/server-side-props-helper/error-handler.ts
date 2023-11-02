import { IncomingMessage } from 'http';
import { GetServerSidePropsContext } from 'next';
import { HttpNotFound } from '#clients/exceptions';
import {
  IsLikelyASirenOrSiretException,
  IsLikelyAnIdRnfException,
  NotASirenError,
  NotASiretError,
  NotAnIdRnfError,
  NotLuhnValidSirenError,
  NotLuhnValidSiretError,
  RnfNotFoundError,
  SearchEngineError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '#models/index';
import { verifySiren, verifySiret } from '#utils/helpers';
import {
  redirectIdRnfIntrouvable,
  redirectIdRnfInvalid,
  redirectIfIdRnf,
  redirectIfSiretOrSiren,
  redirectPageNotFound,
  redirectSearchEngineError,
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
    } else if (exception instanceof IsLikelyAnIdRnfException) {
      return redirectIfIdRnf(message);
    } else if (exception instanceof NotAnIdRnfError) {
      return redirectIdRnfInvalid(message);
    } else if (exception instanceof RnfNotFoundError) {
      return redirectIdRnfIntrouvable(message);
    } else if (exception instanceof HttpNotFound) {
      return redirectPageNotFound(message, scope);
    } else if (exception instanceof SearchEngineError) {
      return redirectSearchEngineError(message, scope);
    } else {
      return redirectServerError(message, scope);
    }
  } catch (e: any) {
    console.error('=== Error-handler failed to handle exception ===');
    console.error(exception);
    console.error(e);
    return redirectServerError('Error-handler failed to handle exception', {});
  }
};

const getScope = (req: IncomingMessage | undefined, slug: string) => {
  let sirenOrSiret = {} as any;

  try {
    sirenOrSiret = { siren: verifySiren(slug) };
  } catch {
    try {
      sirenOrSiret = {
        siret: verifySiret(slug),
      };
    } catch {
      sirenOrSiret.slug = slug;
    }
  }

  const headers = req?.headers || {};
  const metadata = req
    ? {
        page: req.url,
        referer: headers['referer'],
        browser: headers['user-agent'] as string,
      }
    : {};

  return {
    ...metadata,
    ...sirenOrSiret,
  };
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
