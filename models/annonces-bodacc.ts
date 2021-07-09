import { IUniteLegale } from '.';
import fetchAnnoncesBodacc from '../clients/open-data-soft/bodacc';
import { Siren, verifySiren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';

export interface IAnnoncesBodacc {
  titre: string;
  sousTitre: string;
  typeAvisLibelle: string;
  tribunal: string;
  numeroAnnonce: number;
  datePublication: string;
  details: string;
  path: string;
}

const getAnnoncesBodaccFromSlug = async (
  slug: string
): Promise<IAnnoncesBodacc[] | IAPINotRespondingError> => {
  const siren = verifySiren(slug);
  try {
    return await fetchAnnoncesBodacc(siren);
  } catch (e) {
    const errorMessage = `${siren} error in API BODACC : ${e}`;
    logErrorInSentry(new Error(errorMessage), { siren });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};

export default getAnnoncesBodaccFromSlug;
