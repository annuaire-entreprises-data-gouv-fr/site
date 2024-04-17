import { cache } from 'react';
import { extractSirenOrSiretSlugFromUrl } from '#utils/helpers';
import { getUniteLegaleFromSlug } from './unite-legale';

/**
 *  Call this function to rely on react cache when using an unite legale
 */
export const cachedGetUniteLegale = cache(
  async (slug: string, isBot: boolean, page = 0) => {
    const sirenSlug = extractSirenOrSiretSlugFromUrl(slug);
    const uniteLegale = await getUniteLegaleFromSlug(sirenSlug, {
      isBot,
      page,
    });
    return uniteLegale;
  }
);
