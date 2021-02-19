import { RncsHttpServerError, fetchRncsImmatriculation } from '../clients/rncs';
import { RnmHttpServerError, fetchRnmImmatriculation } from '../clients/rnm';

import routes from '../clients/routes';
import logErrorInSentry from '../utils/sentry';

export interface ImmatriculationLinks {
  rncsLink: string | null;
  rnmLink: string | null;
}

/**
 * Download Unite Legale from Etalab SIRENE API (fallback on INSEE's API)
 * @param siren
 */
const getImmatriculations = async (
  siren: string
): Promise<ImmatriculationLinks> => {
  let existInRncs, existInRnm;
  try {
    const rncsImmatriculation = await fetchRncsImmatriculation(siren);
    const rnmImmatriculation = await fetchRnmImmatriculation(siren);

    // shall we test response or catch HttpResponseNotFound ?
    existInRncs = rncsImmatriculation && rncsImmatriculation !== {};
    existInRnm = rnmImmatriculation && rnmImmatriculation !== {};
  } catch (e) {
    // not very happy with this architecture in case of async as it might shadow an error if several are thrown
    if (e instanceof RnmHttpServerError) {
      logErrorInSentry(`Error in API RNM for ${siren} : ${e}`);
    }
    if (e instanceof RncsHttpServerError) {
      logErrorInSentry(`Error in API RNCS for ${siren} : ${e}`);
    }
  } finally {
    return {
      rncsLink: existInRncs ? routes.rncs.portail + siren : null,
      rnmLink: existInRnm ? routes.rnm + siren : null,
    };
  }
};

export default getImmatriculations;
