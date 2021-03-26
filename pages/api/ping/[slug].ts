import { NextApiRequest, NextApiResponse } from 'next';
import { HttpNotFound } from '../../../clients/exceptions';
import { fetchRncsImmatriculation } from '../../../clients/rncs';
import { fetchRnmImmatriculation } from '../../../clients/rnm';
import { getUniteLegaleInsee } from '../../../clients/sirene-insee/siren';
import getUniteLegaleSireneOuverte from '../../../clients/sirene-ouverte/siren';
import fetchConventionCollectives from '../../../clients/siret-2-idcc';

const testApi = async (slug: string | string[]) => {
  switch (slug) {
    case 'rncs':
      return await fetchRncsImmatriculation('880878145');
    case 'rnm':
      return await fetchRnmImmatriculation('824024350');
    case 'conventions-collectives':
      return await fetchConventionCollectives(['54205118000066']);
    case 'sirene-insee':
      return await getUniteLegaleInsee('880878145');
    case 'sirene-donnees-ouvertes':
      return await getUniteLegaleSireneOuverte('880878145');
    default:
      return null;
  }
};

const ping = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  if (slug) {
    try {
      if ((await testApi(slug)) === null) {
        res.status(404).json({ message: `Slug: ${slug} not found.` });
      }
      res.status(200).json({ message: 'ok' });
    } catch (e) {
      res.status(500).json({ message: 'ko' });
    }
  } else {
    res.status(404).json({ message: `Slug: ${slug} not found.` });
  }
};

export default ping;
