import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpForbiddenError } from '#clients/exceptions';
import { getDonneesRestreintesEntreprise } from '#models/espace-agent/donnees-restreintes-entreprise';
import { extractSirenFromSiret, verifySiret } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { isSuperAgent, sessionOptions } from '#utils/session';

export default withIronSessionApiRoute(conformite, sessionOptions);

async function conformite(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug },
    session,
  } = req;

  try {
    if (!isSuperAgent(session)) {
      throw new HttpForbiddenError('Unauthorized account');
    }

    const siret = verifySiret(slug as string);
    const siren = extractSirenFromSiret(siret);

    const donneesRestreintes = await getDonneesRestreintesEntreprise(
      siren,
      siret
    );
    res.status(200).json(donneesRestreintes);
  } catch (e: any) {
    const message = 'Failed to get donnees restreintes';
    logErrorInSentry(e, { siret: slug as string, errorName: message });
    res.status(e.status || 500).json({ message });
  }
}
