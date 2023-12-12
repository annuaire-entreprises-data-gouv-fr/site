import { HttpNotFound } from '#clients/exceptions';
import { clientJOAFE } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import { IdRna, Siren, verifyIdRna } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IImmatriculation } from '.';
import { NotAValidIdRnaError } from '..';

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
    if (e instanceof HttpNotFound || e instanceof NotAValidIdRnaError) {
      return APINotRespondingFactory(EAdministration.DILA, 404);
    }

    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'ImmatriculationJOAFE',
        context: {
          siren,
          idRna: idRnaAsString,
        },
        administration: EAdministration.DILA,
      })
    );
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};
