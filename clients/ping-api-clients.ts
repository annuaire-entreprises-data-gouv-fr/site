import { clientAssociation } from '#clients/api-proxy/association';
import { clientUniteLegaleInseeNoCache } from '#clients/sirene-insee/siren';
import clientSiret2Idcc from '#clients/siret-2-idcc';
import { clientTVA } from '#clients/tva';
import { verifyIdRna, verifySiren } from '#utils/helpers';
import { clientApiEntrepriseAssociation } from './api-entreprise/association';
import { fetchRNCSImmatriculation } from './api-proxy/rncs';
import { fetchRNEImmatriculation } from './api-proxy/rne';
import clientSearchRechercheEntreprise from './recherche-entreprise';
import { clientUniteLegaleRechercheEntreprise } from './recherche-entreprise/siren';

export class APISlugNotFound extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}

const ping = async (slug: string | string[]) => {
  const useCache = false;
  switch (slug) {
    case 'api-proxy-rncs':
      // fetch IRM and disable cache
      return await fetchRNCSImmatriculation(verifySiren('552032534'), useCache);
    case 'api-proxy-rne':
      // fetch IRM and disable cache
      return await fetchRNEImmatriculation(verifySiren('552032534'), useCache);
    case 'api-conventions-collectives':
      return await clientSiret2Idcc(['54205118000066']);
    case 'api-sirene-insee':
      return await clientUniteLegaleInseeNoCache(verifySiren('880878145'));
    case 'api-sirene-donnees-ouvertes':
      return await clientUniteLegaleRechercheEntreprise(
        verifySiren('880878145')
      );
    case 'api-association':
      return await clientAssociation(verifyIdRna('W551000280'), useCache);
    case 'api-tva':
      return await clientTVA(verifySiren('880878145'), useCache);
    case 'api-entreprise-association':
      return await clientApiEntrepriseAssociation(
        verifySiren('842019051'),
        useCache
      );
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
