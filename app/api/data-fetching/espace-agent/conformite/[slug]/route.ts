import useSessionServer from 'hooks/use-session-server';
import { HttpForbiddenError } from '#clients/exceptions';
import { getDonneesRestreintesEntreprise } from '#models/espace-agent/donnees-restreintes-entreprise';
import { FetchRessourceException } from '#models/exceptions';
import { extractSirenFromSiret, verifySiret } from '#utils/helpers';
import { logFatalErrorInSentry } from '#utils/sentry';
import { isSuperAgent } from '#utils/session';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await useSessionServer();
  const slug = params.slug;
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
    return Response.json(donneesRestreintes, { status: 200 });
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
    return Response.json({ message }, { status: e.status || 500 });
  }
}
