import { fetchRNEImmatriculation } from '#clients/api-proxy/rne';
import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { Siren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IImmatriculationRNCS } from './rncs';

export interface IImmatriculationRNE extends IImmatriculationRNCS {}

/*
 * Request Immatriculation from INPI's RNCS
 * @param siren
 */
const getImmatriculationRNE = async (
  siren: Siren
): Promise<IAPINotRespondingError | IImmatriculationRNE> => {
  try {
    // fetch RNE and use cache
    const { identite, metadata, dirigeants, beneficiaires } =
      await fetchRNEImmatriculation(siren);

    return {
      siren,
      downloadLink: `${routes.rne.portail.pdf}?format=pdf&ids=[%22${siren}%22]`,
      siteLink: `${routes.rncs.portail.entreprise}${siren}`,
      identite,
      dirigeants,
      beneficiaires,
      metadata,
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    logErrorInSentry('Error in RNE : API and fallback failed', {
      siren,
      details: e.toString(),
    });

    return APINotRespondingFactory(EAdministration.INPI, 500);
  }
};

export default getImmatriculationRNE;
