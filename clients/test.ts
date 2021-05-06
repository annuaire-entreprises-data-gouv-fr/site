import { getAssociation } from './rna';
import { fetchRncsImmatriculation } from './rncs';
import { fetchRnmImmatriculation } from './rnm';
import { getUniteLegaleInsee } from './sirene-insee/siren';
import getUniteLegaleSireneOuverte from './sirene-ouverte/siren';
import fetchConventionCollectives from './siret-2-idcc';

export class APISlugNotFound extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}

const testApi = async (slug: string | string[]) => {
  switch (slug) {
    case 'api-rncs':
      return await fetchRncsImmatriculation('880878145');
    case 'api-rnm':
      return await fetchRnmImmatriculation('824024350');
    case 'api-conventions-collectives':
      return await fetchConventionCollectives(['54205118000066']);
    case 'api-sirene-insee':
      return await getUniteLegaleInsee('880878145');
    case 'api-sirene-donnees-ouvertes':
      return await getUniteLegaleSireneOuverte('880878145');
    case 'api-rna':
      return await getAssociation('W551000280');
    default:
      throw new APISlugNotFound(404, `API ping ${slug} not found`);
  }
};

export const isApiOnline = async (slug: string | string[]) => {
  try {
    await testApi(slug);
    return true;
  } catch (e) {
    if (e instanceof APISlugNotFound) {
      throw e;
    } else {
      return false;
    }
  }
};
