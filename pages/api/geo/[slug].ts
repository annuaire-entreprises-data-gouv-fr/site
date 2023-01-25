import { NextApiRequest, NextApiResponse } from 'next';
import { clientCommuneByCp, clientCommunesByName } from '#clients/geo/communes';
import {
  clientDepartementByCode,
  clientDepartementsByName,
} from '#clients/geo/departements';
import logErrorInSentry from '#utils/sentry';
import { withAPM } from '#utils/sentry/apm';

const geo = async (
  { query: { slug = '' } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const term = slug as string;
    const isNumber = /^[0-9]+$/.test(term);
    if (isNumber) {
      // code departement or CP
      if (term.length === 2 || term.length === 3) {
        const dep = await clientDepartementByCode(term);
        res.status(200).json(dep);
        return;
      } else if (term.length === 5) {
        let commune = await clientCommuneByCp(term);
        res.status(200).json(commune);
      }
      res.status(404).end();
    } else {
      const [communes, departements] = await Promise.all([
        clientDepartementsByName(term),
        clientCommunesByName(term),
      ]);
      const results = [...departements.slice(0, 5), ...communes.slice(0, 20)];
      res.status(200).json(results);
    }
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
