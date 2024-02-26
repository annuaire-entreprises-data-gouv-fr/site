import { clientDocuments } from '#clients/api-proxy/rne/documents';
import { HttpForbiddenError, HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException } from '#models/exceptions';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { isAgent } from '#utils/session';
import withSession from '#utils/session/with-session';

export default withSession(async function actes(req, res) {
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

    if (!(e instanceof HttpNotFound)) {
      logErrorInSentry(
        new FetchRessourceException({
          cause: e,
          ressource: 'RNEDocuments',
          message,
          administration: EAdministration.INPI,
          context: { siren: slug as string },
        })
      );
    }
    res.status(e.status || 500).json({ message });
  }
});
