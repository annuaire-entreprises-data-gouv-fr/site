import { redirect } from 'next/navigation';
import { cache } from 'react';
import { extractSirenOrSiretSlugFromUrl } from '#utils/helpers';
import { logInfoInSentry } from '#utils/sentry';
import { getEtablissementWithUniteLegaleFromSlug } from '../../../models/core/etablissement';
import {
  NotASirenError,
  NotASiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '../../../models/core/types';
import { getUniteLegaleFromSlug } from '../../../models/core/unite-legale';

const handleException = (e: any, slug: string) => {
  if (e instanceof NotASirenError || e instanceof NotASiretError) {
    logInfoInSentry(e);
    redirect('/404');
  }
  if (e instanceof SirenNotFoundError || e instanceof SiretNotFoundError) {
    logInfoInSentry(e);
    redirect('/erreur/introuvable/' + slug);
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
