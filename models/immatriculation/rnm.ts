import { IImmatriculation } from '.';
import { HttpNotFound } from '../../clients/exceptions';
import { fetchRnmImmatriculation } from '../../clients/rnm';
import { Siren } from '../../utils/helpers/siren-and-siret';
import logErrorInSentry from '../../utils/sentry';
import { EAdministration } from '../administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '../api-not-responding';

export interface IImmatriculationRNM extends IImmatriculation {
  siren: Siren;
  gestionId: string;
  denomination: string;
  codeAPRM: string;
  activite: string;
  dateImmatriculation: string;
  dateMiseAJour: string;
  dateDebutActivite: string;
  libelleNatureJuridique: string;
  dateRadiation: string;
  adresse: string;
}

/**
 * Request Immatriculation from CMA-France's RNM
 * @param siren
 */
export const getImmatriculationRNM = async (
  siren: Siren
): Promise<IAPINotRespondingError | IImmatriculationRNM> => {
  try {
    return await fetchRnmImmatriculation(siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.CMAFRANCE, 404);
    }

    logErrorInSentry('Error in API RNM', {
      siren,
      details: e.toString(),
    });

    return APINotRespondingFactory(EAdministration.CMAFRANCE, 500);
  }
};
