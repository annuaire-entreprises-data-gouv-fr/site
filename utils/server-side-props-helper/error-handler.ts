import { IncomingMessage } from 'http';
import { GetServerSidePropsContext } from 'next';
import { HttpNotFound } from '#clients/exceptions';
import { Exception, IExceptionContext } from '#models/exceptions';
import {
  FetchRechercheEntrepriseException,
  InternalError,
  IsLikelyASirenOrSiretException,
  NotASirenError,
  NotASiretError,
  NotLuhnValidSirenError,
  NotLuhnValidSiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '#models/index';
import { verifySiren, verifySiret } from '#utils/helpers';
import { logFatalErrorInSentry, logWarningInSentry } from '#utils/sentry';
import {
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
    const context = getContext(req, message);
    exception.context = {
      ...exception.context,
      context,
    };
    const sirenOrSiret = (exception.context.siren ||
      exception.context.siret) as string;

    if (exception instanceof IsLikelyASirenOrSiretException) {
      return redirectIfSiretOrSiren(exception.sirenOrSiret);
    } else if (
      exception instanceof SirenNotFoundError ||
      exception instanceof SiretNotFoundError
    ) {
      logWarningInSentry(exception);
      return redirectSirenOrSiretIntrouvable(sirenOrSiret);
    } else if (
      exception instanceof NotLuhnValidSirenError ||
      exception instanceof NotLuhnValidSiretError
    ) {
      logWarningInSentry(exception);
      return redirectSirenOrSiretInvalid(sirenOrSiret);
    } else if (
      exception instanceof NotASirenError ||
      exception instanceof NotASiretError ||
      exception instanceof HttpNotFound
    ) {
      logWarningInSentry(
        new Exception({
          name: 'PageNotFoundException',
          cause: exception,
          context,
        })
      );
      return redirectPageNotFound();
    } else if (exception instanceof FetchRechercheEntrepriseException) {
      logFatalErrorInSentry(exception);
      return redirectSearchEngineError();
    } else {
      logFatalErrorInSentry(
        new Exception({
          name: 'ServerErrorPageException',
          cause: exception,
          context,
        })
      );
      return redirectServerError();
    }
  } catch (e: any) {
    console.error('=== Error-handler failed to handle exception ===');
    console.error(exception);
    console.error(e);
    e.cause = exception;
    const internalError = new InternalError({
      message: 'Error-handler failed to handle exception',
      cause: e,
    });
    logFatalErrorInSentry(internalError);
    return redirectServerError();
  }
};

const getContext = (
  req: IncomingMessage | undefined,
  slug: string
): IExceptionContext => {
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
