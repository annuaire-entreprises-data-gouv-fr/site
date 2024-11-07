import { HttpNotFound } from '#clients/exceptions';
import { Exception } from '#models/exceptions';
import { extractSirenOrSiretSlugFromUrl } from '#utils/helpers';
import { logFatalErrorInSentry, logWarningInSentry } from '#utils/sentry';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import {
  getEtablissementWithLatLongFromSlug,
  getEtablissementWithUniteLegaleFromSlug,
} from '../../../models/core/etablissement';
import {
  FetchRechercheEntrepriseException,
  NotASirenError,
  NotASiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '../../../models/core/types';
import { getUniteLegaleFromSlug } from '../../../models/core/unite-legale';

const handleException = (e: any, slug: string) => {
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
};

/**
 *  Call this function to rely on react cache when using an unite legale
 */
export const cachedGetUniteLegale = cache(
  async (slug: string, isBot: boolean, page = 1) => {
    const sirenSlug = extractSirenOrSiretSlugFromUrl(slug);
    try {
      return await getUniteLegaleFromSlug(sirenSlug, {
        isBot,
        page,
      });
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

export const cachedEtablissementWithLatLong = cache(async (slug: string) => {
  const siretSlug = extractSirenOrSiretSlugFromUrl(slug);
  try {
    return await getEtablissementWithLatLongFromSlug(siretSlug);
  } catch (e) {
    handleException(e, siretSlug);
    throw e;
  }
});
