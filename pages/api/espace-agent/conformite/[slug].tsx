import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { isSuperAgent, sessionOptions } from '#utils/session';
import { extractSirenFromSiret, verifySiret } from '#utils/helpers';
import { getDonneesRestreintesEntreprise } from '#models/espace-agent/donnees-restreintes-entreprise';
import logErrorInSentry from '#utils/sentry';
import { HttpForbiddenError } from '#clients/exceptions';

export default withIronSessionApiRoute(conformite, sessionOptions);

async function conformite(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query: { slug }, session } = req;

  try {
    if (!isSuperAgent(session)) {
      throw new HttpForbiddenError('Unauthorized account');
    }

    const siret = verifySiret(slug as string);
    const siren = extractSirenFromSiret(siret);
    
    const donneesRestreintes = await getDonneesRestreintesEntreprise(siren, siret);
    res.status(200).json(donneesRestreintes);
  } catch (e: any) {
    const message = 'Failed to get donnees restreintes';
    logErrorInSentry(message, { siret: slug as string, details: e });
    res.status(e.status || 500).json({ message });
  }
}
