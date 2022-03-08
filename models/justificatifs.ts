import { IUniteLegale } from '.';
import { verifySiren } from '../utils/helpers/siren-and-siret';
import { IAPINotRespondingError } from './api-not-responding';
import { NotAValidIdRnaError } from '.';
import { HttpNotFound } from '../clients/exceptions';
import { fetchRNCSImmatriculationSiteFallback } from '../clients/rncs/IMR-site';
import fetchAnnoncesJO from '../clients/open-data-soft/journal-officiel-associations';
import { fetchRnmImmatriculation } from '../clients/rnm';
import { IdRna, verifyIdRna } from '../utils/helpers/id-rna';
import { Siren } from '../utils/helpers/siren-and-siret';

import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administration';
import { APINotRespondingFactory } from './api-not-responding';
import { IIdentite } from './dirigeants';
import routes from '../clients/routes';
import { fetchRNCSImmatriculation } from '../clients/rncs/IMR-api';
import { getUniteLegaleFromSlug } from './unite-legale';
import getIMR from './IMR';

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  immatriculationRNM: IImmatriculationRNM | IAPINotRespondingError;
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
  immatriculationJOAFE: IImmatriculationJOAFE | IAPINotRespondingError;
}

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

const getJustificatifs = async (slug: string) => {
  const siren = verifySiren(slug);

  const [uniteLegale, immatriculationRNM, immatriculationRNCS] =
    await Promise.all([
      getUniteLegaleFromSlug(siren),
      getImmatriculationRNM(siren),
      getImmatriculationRNCS(siren),
    ]);

  const immatriculationJOAFE = await getImmatriculationJOAFE(
    siren,
    uniteLegale.association?.id || null
  );

  return {
    uniteLegale,
    immatriculationRNM,
    immatriculationRNCS,
    immatriculationJOAFE,
  };
};

/**
 * Request Immatriculation from CMA-France's RNM
 * @param siren
 */
const getImmatriculationRNM = async (siren: Siren) => {
  try {
    return await fetchRnmImmatriculation(siren);
  } catch (e: any) {
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
const getImmatriculationRNCS = async (siren: Siren) => {
  try {
    const { identite } = await getIMR(siren);
    return {
      ...identite,
      siren,
      downloadlink: routes.rncs.portail.entreprise + siren,
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INPI, 404);
    }

    logErrorInSentry(new Error('Error in INPI : API and fallback failed'), {
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
const getImmatriculationJOAFE = async (
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
  } catch (e: any) {
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

export default getJustificatifs;
