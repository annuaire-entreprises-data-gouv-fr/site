import { NextApiRequest, NextApiResponse } from 'next';
import { getAssociationFromSlug } from '#models/association';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { withAPM } from '#utils/sentry/tracing';
import withAntiBot from '#utils/session/with-anti-bot';

export default withAPM(
  withAntiBot(async function (
    { query: { slug = '' } }: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const immatriculation = await getAssociationFromSlug(slug as string);
      res.status(200).json(immatriculation);
    } catch (e: any) {
      const message = 'Failed to fetch Association';
      res.status(500);
      res.json({ message });
      logErrorInSentry(
        new FetchRessourceException({
          cause: e,
          ressource: 'Association',
          context: {
            slug: slug as string,
          },
        })
      );
    }
  })
);
