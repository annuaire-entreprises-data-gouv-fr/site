import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { clientActes } from '#clients/api-proxy/rne/documents';
import { HttpForbiddenError } from '#clients/exceptions';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { isAgent, sessionOptions } from '#utils/session';

export default withIronSessionApiRoute(actes, sessionOptions);

async function actes(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug },
    session,
  } = req;

  try {
    if (!isAgent(session)) {
      throw new HttpForbiddenError('Unauthorized account');
    }

    const siren = verifySiren(slug as string);

    const actes = await clientActes(siren);
    res.status(200).json(actes);
  } catch (e: any) {
    const message = 'Failed to fetch document list';
    logErrorInSentry(e, { siret: slug as string, errorName: message });
    res.status(e.status || 500).json({ message });
  }
}
