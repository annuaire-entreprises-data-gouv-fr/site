import { NextApiRequest, NextApiResponse } from 'next';
import { clientCommuneByCp, clientCommunesByName } from '#clients/geo/communes';
import {
  clientDepartementByCode,
  clientDepartementsByName,
} from '#clients/geo/departements';
import { clientRegionsByName } from '#clients/geo/regions';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { withAPM } from '#utils/sentry/tracing';

const geo = async (
  { query: { slug = '' } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const term = slug as string;
    const isNumber = /^[0-9]+$/.test(term);
    if (isNumber) {
      if (term.length < 6) {
        // code departement or CP

        let suggests = [];
        if (term.length <= 2) {
          const testDepCode = `${term}${'0'.repeat(2 - term.length)}`;
          suggests = await clientDepartementByCode(testDepCode);
        } else {
          const testCommuneCode = `${term}${'0'.repeat(5 - term.length)}`;
          suggests = await clientCommuneByCp(testCommuneCode);
        }
        res.status(200).json(suggests);
      }

      res.status(404).end();
    } else {
      const [departements, communes, regions] = await Promise.all([
        clientDepartementsByName(term),
        clientCommunesByName(term),
        clientRegionsByName(term),
      ]);
      const results = [
        ...regions,
        ...departements.slice(0, 5),
        ...communes.slice(0, 20),
      ];
      res.status(200).json(results);
    }
  } catch (e: any) {
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'Geo',
        context: {
          slug: slug as string,
        },
      })
    );
    res
      .status(e.status || 500)
      .json({ message: 'failed to determine localisation' });
  }
};

export default withAPM(geo);
