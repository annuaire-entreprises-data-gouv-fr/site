import { redirect } from 'next/navigation';
import { cache } from 'react';
import { extractSirenOrSiretSlugFromUrl } from '#utils/helpers';
import { NotASirenError } from './types';
import { getUniteLegaleFromSlug } from './unite-legale';

/**
 *  Call this function to rely on react cache when using an unite legale
 */
export const cachedGetUniteLegale = cache(
  async (slug: string, isBot: boolean, page = 0) => {
    try {
      const sirenSlug = extractSirenOrSiretSlugFromUrl(slug);
      const uniteLegale = await getUniteLegaleFromSlug(sirenSlug, {
        isBot,
        page,
      });
      return uniteLegale;
    } catch (e) {
      if (e instanceof NotASirenError) {
        redirect('/404');
      }
      throw e;
    }
  }
);
