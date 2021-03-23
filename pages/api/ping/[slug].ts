import { NextApiRequest, NextApiResponse } from 'next';
import { fetchRncsImmatriculation } from '../../../clients/rncs';
import { fetchRnmImmatriculation } from '../../../clients/rnm';
import { getUniteLegaleInsee } from '../../../clients/sirene-insee/siren';
import getUniteLegaleSireneOuverte from '../../../clients/sirene-ouverte/siren';
import fetchConventionCollectives from '../../../clients/siret-2-idcc';

const ping = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  if (slug) {
    try {
      switch (slug) {
        case 'rncs':
          await fetchRncsImmatriculation('880878145');
        case 'rnm':
          await fetchRnmImmatriculation('824024350');
        case 'convention-collectives':
          await fetchConventionCollectives(['54205118000066']);
        case 'sirene-insee':
          await getUniteLegaleInsee('880878145');
        case 'sirene-donnees-ouvertes':
          await getUniteLegaleSireneOuverte('880878145');
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
