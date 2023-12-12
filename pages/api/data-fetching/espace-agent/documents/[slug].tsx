import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { clientDocuments } from '#clients/api-proxy/rne/documents';
import { HttpForbiddenError } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
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

    const actes = await clientDocuments(siren);
    actes.hasBilanConsolide =
      actes.bilans.filter((b) => b.typeBilan === 'K').length > 0;

    res.status(200).json(actes);
  } catch (e: any) {
    const message = 'Failed to fetch document list';
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'RNEDocuments',
        message,
        administration: EAdministration.INPI,
        context: { siren: slug as string },
      })
    );
    res.status(e.status || 500).json({ message });
  }
}
