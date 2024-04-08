import { HttpNotFound } from '#clients/exceptions';
import {
  FetchRechercheEntrepriseException,
  IsLikelyASirenOrSiretException,
  NotASirenError,
  NotASiretError,
  NotLuhnValidSirenError,
  NotLuhnValidSiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '#models/core/types';
import {
  Exception,
  IExceptionContext,
  InternalError,
} from '#models/exceptions';
import { hasSirenFormat, hasSiretFormat } from '#utils/helpers';
import { logFatalErrorInSentry, logWarningInSentry } from '#utils/sentry';

const redirects = {
  notFound: { destination: '/404' },
  serverError: { destination: '/500' },
  searchError: { destination: '/rechercher/erreur' },
};

/**
 * Siren/Siret is NOT valid
 */
const destinationSirenOrSiretInvalid = (sirenOrSiret: string) => {
  return {
    destination: `/erreur/invalide/${sirenOrSiret}`,
  };
};

/**
 * Siren/Siret is valid but not found
 */
const destinationSirenOrSiretIntrouvable = (sirenOrSiret: string) => {
  return {
    destination: `/erreur/introuvable/${sirenOrSiret}`,
  };
};

const destinationIfSiretOrSiren = (siretOrSiren: string) => {
  if (hasSiretFormat(siretOrSiren)) {
    return { destination: `/etablissement/${siretOrSiren}?redirected=1` };
  } else if (hasSirenFormat(siretOrSiren)) {
    return { destination: `/entreprise/${siretOrSiren}?redirected=1` };
  } else {
    throw new InternalError({
      message: `${siretOrSiren} is neither a siret or a siren`,
    });
  }
};

export type IRedirect = {
  destination: string;
};

export const errorRedirection = (
  exception: any,
  context: IExceptionContext
): IRedirect => {
  try {
    exception.context = {
      ...exception.context,
      ...context,
    };
    const sirenOrSiret = (exception.context.siren ||
      exception.context.siret) as string;

    if (exception instanceof IsLikelyASirenOrSiretException) {
      return destinationIfSiretOrSiren(exception.sirenOrSiret);
    } else if (
      exception instanceof SirenNotFoundError ||
      exception instanceof SiretNotFoundError
    ) {
      logWarningInSentry(exception);
      return destinationSirenOrSiretIntrouvable(sirenOrSiret);
    } else if (
      exception instanceof NotLuhnValidSirenError ||
      exception instanceof NotLuhnValidSiretError
    ) {
      logWarningInSentry(exception);
      return destinationSirenOrSiretInvalid(sirenOrSiret);
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
      return redirects.notFound;
    } else if (exception instanceof FetchRechercheEntrepriseException) {
      logFatalErrorInSentry(exception);
      return redirects.searchError;
    } else {
      logFatalErrorInSentry(
        new Exception({
          name: 'ServerErrorPageException',
          cause: exception,
          context,
        })
      );
      return redirects.serverError;
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
    return redirects.serverError;
  }
};
