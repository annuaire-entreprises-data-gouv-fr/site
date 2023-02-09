import { clientAssociation } from '#clients/association';
import clientSearchSireneOuverte from '#clients/recherche-entreprise';
import { clientRNM } from '#clients/rnm';
import { clientUniteLegaleInseeNoCache } from '#clients/sirene-insee/siren';
import clientUniteLegaleSireneOuverte from '#clients/sirene-ouverte/siren';
import clientSiret2Idcc from '#clients/siret-2-idcc';
import { clientTVA } from '#clients/tva';
import { verifyIdRna, verifySiren } from '#utils/helpers';
import { fetchRNCSImmatriculationNoCache } from './api-proxy';

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
      return await fetchRNCSImmatriculationNoCache(verifySiren('880878145'));
    case 'api-rnm':
      return await clientRNM(verifySiren('824024350'));
    case 'api-conventions-collectives':
      return await clientSiret2Idcc(['54205118000066']);
    case 'api-sirene-insee':
      return await clientUniteLegaleInseeNoCache(verifySiren('880878145'));
    case 'api-sirene-donnees-ouvertes':
      return await clientUniteLegaleSireneOuverte(verifySiren('880878145'));
    case 'api-rna':
      return await clientAssociation(verifyIdRna('W551000280'));
    case 'api-tva':
      return await clientTVA(verifySiren('880878145'), useCache);
    case 'api-recherche':
      return await clientSearchSireneOuverte(
        'test',
        1,
        undefined,
        false,
        false
      );
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
