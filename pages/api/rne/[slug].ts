import { NextApiRequest, NextApiResponse } from 'next';
import getImmatriculationRNE from '#models/immatriculation/rne';
import { NotASirenError, NotLuhnValidSirenError } from '#models/index';
import { verifySiren } from '#utils/helpers';
import { withAPM } from '#utils/sentry/tracing';

const getRNE = async (
  { query: { slug = '' } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const siren = verifySiren(slug as string);
    const immatriculation = await getImmatriculationRNE(siren);
    res.status(200).json(immatriculation);
  } catch (e: any) {
    if (e instanceof NotASirenError || e instanceof NotLuhnValidSirenError) {
      res.status(400).json({ message: e.message });
    } else {
      res.status(500).json({ message: 'Failed to fetch RNE immatriculation' });
    }
  }
};

export default withAPM(getRNE);
