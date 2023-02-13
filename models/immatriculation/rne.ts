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
import { IImmatriculation } from '.';

export interface IImmatriculationRNCSCore {
  identite: {};
  metadata: {
    isFallback: boolean;
  };
}

export interface IImmatriculationRNE extends IImmatriculation {
  identite: {
    denomination: string;
    dateImmatriculation: string;
    dateDebutActiv: string;
    dateRadiation: string;
    dateCessationActivite: string;
    isPersonneMorale: boolean;
    dateClotureExercice: string;
    dureePersonneMorale: string;
    capital: string;
    codeNatureJuridique: string;
  } | null;
  metadata: {
    isFallback: boolean;
  };
  siren: Siren;
}

/*
 * Request Immatriculation from INPI's RNCS
 * @param siren
 */
const getImmatriculationRNE = async (
  siren: Siren
): Promise<IAPINotRespondingError | IImmatriculationRNE> => {
  try {
    // fetch IMR and use cache
    const { identite = null, metadata } = await fetchRNEImmatriculation(siren);

    return {
      siren,
      downloadLink: `${routes.rne.portail.pdf}?format=pdf&ids=[%22${siren}%22]`,
      siteLink: `${routes.rncs.portail.entreprise}${siren}`,
      identite,
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
