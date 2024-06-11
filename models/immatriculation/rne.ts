import { fetchRNEImmatriculation } from '#clients/api-proxy/rne';
import { clientDocuments } from '#clients/api-proxy/rne/documents';
import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { IImmatriculationRNE } from '.';

/*
 * Request Immatriculation from INPI's RNE
 * @param siren
 */
export const getImmatriculationRNE = async (
  maybeSiren: string
): Promise<IAPINotRespondingError | IImmatriculationRNE> => {
  const siren = verifySiren(maybeSiren);

  try {
    // fetch RNE and use cache
    const {
      identite,
      metadata,
      dirigeants,
      beneficiaires,
      observations = [],
    } = await fetchRNEImmatriculation(siren);

    return {
      siren,
      downloadLink: `${routes.rne.portail.pdf}?format=pdf&ids=[%22${siren}%22]`,
      siteLink: `${routes.rne.portail.entreprise}${siren}`,
      identite,
      dirigeants,
      beneficiaires,
      observations,
      metadata,
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    // no need to log an error as API-Proxy already logged it

    return APINotRespondingFactory(EAdministration.INPI, 500);
  }
};

export async function getDocumentsRNEProtected(maybeSiren: string) {
  const siren = verifySiren(maybeSiren);

  try {
    const actes = await clientDocuments(siren);
    actes.hasBilanConsolide =
      actes.bilans.filter((b) => b.typeBilan === 'K').length > 0;
    return actes;
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    // no need to log an error as API-Proxy already logged it

    return APINotRespondingFactory(EAdministration.INPI, 500);
  }
}
