import { HttpForbiddenError } from '#clients/exceptions';
import { getDonneesRestreintesEntreprise } from '#models/espace-agent/donnees-restreintes-entreprise';
import { FetchRessourceException } from '#models/exceptions';
import { extractSirenFromSiret, verifySiret } from '#utils/helpers';
import { logFatalErrorInSentry } from '#utils/sentry';
import { isSuperAgent } from '#utils/session';
import withSession from '#utils/session/with-session';

export default withSession(async function conformite(req, res) {
  const {
    query: { slug },
    session,
  } = req;

  try {
    if (!isSuperAgent(session)) {
      throw new HttpForbiddenError('Unauthorized account');
    }

    const agentSiret = session?.user?.siret;

    const siret = verifySiret(slug as string);
    const siren = extractSirenFromSiret(siret);

    const donneesRestreintes = await getDonneesRestreintesEntreprise(
      siren,
      siret,
      agentSiret
    );
    res.status(200).json(donneesRestreintes);
  } catch (e: any) {
    const message = 'Failed to get donnees conformite';
    logFatalErrorInSentry(
      new FetchRessourceException({
        ressource: 'DonneesConformite',
        context: { siret: slug as string },
        cause: e,
        message,
      })
    );
    res.status(e.status || 500).json({ message });
  }
});
