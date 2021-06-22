import { isSiren, verifySiren } from '../utils/helpers/siren-and-siret';
import { getAssociation } from './rna';
import { fetchRNCSImmatriculation } from './rncs';
import { fetchRnmImmatriculation } from './rnm';
import { getUniteLegaleInseeWithFallbackCredentials } from './sirene-insee/siren';
import getUniteLegaleSireneOuverte from './sirene-ouverte/siren';
import fetchConventionCollectives from './siret-2-idcc';

export class APISlugNotFound extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}

const ping = async (slug: string | string[]) => {
  switch (slug) {
    case 'api-rncs':
      return await fetchRNCSImmatriculation(verifySiren('880878145'));
    case 'api-rnm':
      return await fetchRnmImmatriculation(verifySiren('824024350'));
    case 'api-conventions-collectives':
      return await fetchConventionCollectives(['54205118000066']);
    case 'api-sirene-insee':
      return await getUniteLegaleInseeWithFallbackCredentials(
        verifySiren('880878145')
      );
    case 'api-sirene-donnees-ouvertes':
      return await getUniteLegaleSireneOuverte('880878145');
    case 'api-rna':
      return await getAssociation('W551000280');
    default:
      throw new APISlugNotFound(404, `API ping ${slug} not found`);
  }
};

export const pingAPIClient = async (slug: string | string[]) => {
  try {
    await ping(slug);
    return { test: true, status: 200 };
  } catch (e) {
    if (e instanceof APISlugNotFound) {
      throw e;
    } else {
      return { test: false, status: e.status | 500 };
    }
  }
};
