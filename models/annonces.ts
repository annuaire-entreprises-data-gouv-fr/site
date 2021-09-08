import fetchAnnoncesBodacc from '../clients/open-data-soft/bodacc';
import fetchAnnoncesJO from '../clients/open-data-soft/journal-officiel-assoications';
import { Siren, verifySiren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';
import { getUniteLegaleFromSlug } from './unite-legale';

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

export interface IAnnoncesJO {
  typeAvisLibelle: string;
  numeroParution: string;
  datePublication: string;
  details: string;
  path: string;
}

const getAnnoncesFromSlug = async (siren: string) => {
  const [uniteLegale, annoncesBodacc] = await Promise.all([
    getUniteLegaleFromSlug(siren),
    getAnnoncesBodaccFromSlug(siren),
  ]);

  let annoncesJO;
  if (uniteLegale.association && uniteLegale.association.id) {
    annoncesJO = await getAnnoncesJoFromIdRna(
      uniteLegale.association.id,
      uniteLegale.siren
    );
  }

  return {
    uniteLegale,
    annoncesBodacc,
    annoncesJO,
  };
};

const getAnnoncesJoFromIdRna = async (
  idRna: string,
  siren: Siren
): Promise<IAnnoncesJO[] | IAPINotRespondingError> => {
  try {
    return await fetchAnnoncesJO(idRna);
  } catch (e) {
    logErrorInSentry(new Error('Error in API Journal Officiel'), {
      siren,
      details: `${JSON.stringify(e)}`,
    });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};

const getAnnoncesBodaccFromSlug = async (
  slug: string
): Promise<IAnnoncesBodacc[] | IAPINotRespondingError> => {
  const siren = verifySiren(slug);
  try {
    return await fetchAnnoncesBodacc(siren);
  } catch (e) {
    logErrorInSentry(new Error('Error in API BODACC'), {
      siren,
      details: `${JSON.stringify(e)}`,
    });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};

export default getAnnoncesFromSlug;
