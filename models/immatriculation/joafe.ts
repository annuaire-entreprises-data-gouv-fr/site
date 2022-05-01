import { IImmatriculation } from '.';
import { NotAValidIdRnaError } from '..';
import { HttpNotFound } from '../../clients/exceptions';
import fetchAnnoncesJO from '../../clients/open-data-soft/journal-officiel-associations';
import { IdRna, verifyIdRna } from '../../utils/helpers/id-rna';
import { Siren } from '../../utils/helpers/siren-and-siret';
import logErrorInSentry from '../../utils/sentry';
import { EAdministration } from '../administration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '../api-not-responding';

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
    const annoncesJO = await fetchAnnoncesJO(idRna);
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
      downloadlink: annonceCreation.path,
    } as IImmatriculationJOAFE;
  } catch (e: any) {
    if (e instanceof HttpNotFound || e instanceof NotAValidIdRnaError) {
      return APINotRespondingFactory(EAdministration.DILA, 404);
    }

    logErrorInSentry('Error in API JOAFE', {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};
