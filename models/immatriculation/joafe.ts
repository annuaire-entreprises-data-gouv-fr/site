import { HttpNotFound } from '#clients/exceptions';
import { clientJOAFE } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { IdRna, Siren, verifyIdRna } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IImmatriculation } from '.';
import { NotAnIdRnaError } from '..';

export interface IImmatriculationJOAFE extends IImmatriculation {
  siren: Siren;
  idRna: IdRna;
  datePublication: string;
}

/**
 * Request Immatriculation from JOAFE
 * @param siren
 */
export const getImmatriculationJOAFE = async (
  siren: Siren,
  idRnaAsString: IdRna | string | null
): Promise<IAPINotRespondingError | IImmatriculationJOAFE> => {
  try {
    const idRna = verifyIdRna(idRnaAsString || '');
    const annoncesJO = await clientJOAFE(idRna);
    const annonceCreation = annoncesJO.annonces.find(
      (annonce) => annonce.typeAvisLibelle === 'Création'
    );
    if (!annonceCreation) {
      throw new HttpNotFound('No annonces found for creation');
    }
    return {
      siren,
      idRna,
      datePublication: annonceCreation.datePublication,
      downloadLink: annonceCreation.path + '?format=pdf',
      siteLink: annonceCreation.path,
    } as IImmatriculationJOAFE;
  } catch (e: any) {
    if (e instanceof HttpNotFound || e instanceof NotAnIdRnaError) {
      return APINotRespondingFactory(EAdministration.DILA, 404);
    }

    logErrorInSentry(e, {
      siren,
      errorName: 'Error in API JOAFE',
    });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};
