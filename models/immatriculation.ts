import { NotAValidIdRnaError } from '.';
import { HttpNotFound } from '../clients/exceptions';
import fetchAnnoncesJO from '../clients/open-data-soft/journal-officiel-associations';
import { fetchRNCSImmatriculation } from '../clients/rncs';
import { fetchRnmImmatriculation } from '../clients/rnm';
import { IdRna, verifyIdRna } from '../utils/helpers/id-rna';
import { Siren } from '../utils/helpers/siren-and-siret';

import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';
import { IIdentite } from './dirigeants';

export interface IImmatriculation {
  downloadlink: string;
}

export interface IImmatriculationJOAFE extends IImmatriculation {
  siren: Siren;
  idRna: IdRna;
  datePublication: string;
}

export interface IImmatriculationRNCS extends IImmatriculation, IIdentite {
  siren: Siren;
}

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
export const getImmatriculationRNM = async (siren: Siren) => {
  try {
    return await fetchRnmImmatriculation(siren);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.CMAFRANCE, 404);
    }

    logErrorInSentry(new Error('Error in API RNM'), {
      siren,
      details: e.toString(),
    });

    return APINotRespondingFactory(EAdministration.CMAFRANCE, 500);
  }
};
/**
 * Request Immatriculation from INPI's RNCS
 * @param siren
 */
export const getImmatriculationRNCS = async (siren: Siren) => {
  try {
    return await fetchRNCSImmatriculation(siren);
  } catch (e) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    logErrorInSentry(new Error('Error in API INPI'), {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.INPI, 500);
  }
};

/**
 * Request Immatriculation from JOAFE
 * @param siren
 */
export const getImmatriculationJOAFE = async (
  siren: Siren,
  idRnaAsString: IdRna | string | null
) => {
  try {
    const idRna = verifyIdRna(idRnaAsString || '');
    const annoncesJO = await fetchAnnoncesJO(idRna);
    const annonceCreation = annoncesJO.annonces.find(
      (annonce) => annonce.typeAvisLibelle === 'Création'
    );
    if (!annonceCreation) {
      throw new HttpNotFound(404, 'No annonces found for creation');
    }
    return {
      siren,
      idRna,
      datePublication: annonceCreation.datePublication,
      downloadlink: annonceCreation.path,
    } as IImmatriculationJOAFE;
  } catch (e) {
    if (e instanceof HttpNotFound || e instanceof NotAValidIdRnaError) {
      return APINotRespondingFactory(EAdministration.DILA, 404);
    }

    logErrorInSentry(new Error('Error in API JOAFE'), {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};
