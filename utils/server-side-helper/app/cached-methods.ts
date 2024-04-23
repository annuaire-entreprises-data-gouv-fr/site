import { redirect } from 'next/navigation';
import { cache } from 'react';
import { HttpNotFound } from '#clients/exceptions';
import { Exception, InternalError } from '#models/exceptions';
import { extractSirenOrSiretSlugFromUrl } from '#utils/helpers';
import { logFatalErrorInSentry, logWarningInSentry } from '#utils/sentry';
import { getEtablissementWithUniteLegaleFromSlug } from '../../../models/core/etablissement';
import {
  FetchRechercheEntrepriseException,
  NotASirenError,
  NotASiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '../../../models/core/types';
import { getUniteLegaleFromSlug } from '../../../models/core/unite-legale';

const handleException = (e: any, slug: string) => {
  try {
    if (
      e instanceof NotASirenError ||
      e instanceof NotASiretError ||
      e instanceof HttpNotFound
    ) {
      logWarningInSentry(
        new Exception({
          name: 'PageNotFoundException',
          cause: e,
          context: { slug },
        })
      );
      redirect('/404');
    } else if (
      e instanceof SirenNotFoundError ||
      e instanceof SiretNotFoundError
    ) {
      logWarningInSentry(
        new Exception({
          name: 'SirenNotFoundOrInvalid',
          cause: e,
          context: { slug },
        })
      );
      redirect('/erreur/introuvable/' + slug);
    } else if (e instanceof FetchRechercheEntrepriseException) {
      logFatalErrorInSentry(e);
      throw e;
    } else {
      logFatalErrorInSentry(
        new Exception({
          name: 'ServerErrorPageException',
          cause: e,
          context: { slug },
        })
      );
    }
  } catch (e2) {
    console.error('=== Error-handler failed to handle exception ===');
    console.error(e2);
    console.error(e);
    e.cause = e2;
    const internalError = new InternalError({
      message: 'Error-handler failed to handle exception',
      cause: e,
    });
    logFatalErrorInSentry(internalError);
  }
};

/**
 *  Call this function to rely on react cache when using an unite legale
 */
export const cachedGetUniteLegale = cache(
  async (slug: string, isBot: boolean, page = 0) => {
    const sirenSlug = extractSirenOrSiretSlugFromUrl(slug);
    try {
      const uniteLegale = await getUniteLegaleFromSlug(sirenSlug, {
        isBot,
        page,
      });
      return uniteLegale;
    } catch (e) {
      handleException(e, sirenSlug);
      throw e;
    }
  }
);

export const cachedEtablissementWithUniteLegale = cache(
  async (slug: string, isBot: boolean) => {
    const siretSlug = extractSirenOrSiretSlugFromUrl(slug);
    try {
      return await getEtablissementWithUniteLegaleFromSlug(siretSlug, isBot);
    } catch (e) {
      handleException(e, siretSlug);
      throw e;
    }
  }
);
