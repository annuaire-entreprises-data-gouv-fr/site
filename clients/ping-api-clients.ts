import { clientAssociation } from '#clients/api-proxy/association';
import { tvaNumber } from '#models/tva/utils';
import { verifyIdRna, verifySiren, verifyTVANumber } from '#utils/helpers';
import { fetchRNEImmatriculation } from './api-proxy/rne';
import { clientTVA } from './api-vies';
import clientSearchRechercheEntreprise from './recherche-entreprise';
import { clientUniteLegaleRechercheEntreprise } from './recherche-entreprise/siren';
import { clientUniteLegaleInsee } from './sirene-insee/siren';

export class APISlugNotFound extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}

const ping = async (slug: string | string[]) => {
  const sirenGanymede = verifySiren('880878145');
  const sirenDanone = verifySiren('552032534');

  const useCache = false;

  switch (slug) {
    case 'api-proxy-rne':
      // fetch IRM and disable cache
      return await fetchRNEImmatriculation(sirenDanone, useCache);
    case 'api-sirene-insee':
      return await clientUniteLegaleInsee(sirenGanymede, {
        useCache,
        useFallback: false,
      });
    case 'api-sirene-donnees-ouvertes':
      return await clientUniteLegaleRechercheEntreprise(sirenGanymede, 1);
    case 'api-association':
      return await clientAssociation(verifyIdRna('W551000280'), '', useCache);
    case 'api-tva':
      const tva = verifyTVANumber(tvaNumber(sirenDanone));
      return await clientTVA(tva, useCache);
    case 'api-recherche':
      return await clientSearchRechercheEntreprise({
        searchTerms: 'test',
        page: 1,
        searchFilterParams: undefined,
        fallbackOnStaging: false,
        useCache,
        inclureEtablissements: false,
      });
    default:
      throw new APISlugNotFound(404, `API ping ${slug} not found`);
  }
};

export const pingAPIClient = async (slug: string | string[]) => {
  try {
    await ping(slug);
    return { test: true, status: 200 };
  } catch (e: any) {
    if (e instanceof APISlugNotFound) {
      throw e;
    } else {
      return { test: false, status: e.status || 500 };
    }
  }
};
