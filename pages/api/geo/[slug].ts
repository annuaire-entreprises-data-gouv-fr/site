import { NextApiRequest, NextApiResponse } from 'next';
import { searchCommunes } from '../../../clients/geo/communes';
import { searchDepartements } from '../../../clients/geo/departements';
import logErrorInSentry from '../../../utils/sentry';
import { withAPM } from '../../../utils/sentry/apm';

const geo = async (
  { query: { slug } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const term = slug as string;
    const [communes, departements] = await Promise.all([
      searchCommunes(term),
      searchDepartements(term),
    ]);

    const results = [...departements.slice(0, 5), ...communes.slice(0, 10)];
    res.status(200).json(results);
  } catch (e: any) {
    logErrorInSentry('failed to determine localisation', {
      details: e.toString(),
    });
    res
      .status(e.status || 500)
      .json({ message: 'failed to determine localisation' });
  }
};

export default withAPM(geo);
