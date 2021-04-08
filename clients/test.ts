import { HttpNotFound } from './exceptions';
import { fetchRncsImmatriculation } from './rncs';
import { fetchRnmImmatriculation } from './rnm';
import { getUniteLegaleInsee } from './sirene-insee/siren';
import getUniteLegaleSireneOuverte from './sirene-ouverte/siren';
import fetchConventionCollectives from './siret-2-idcc';

export const testApi = async (slug: string | string[]) => {
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
    default:
      throw new HttpNotFound(404, `${slug}`);
  }
};
