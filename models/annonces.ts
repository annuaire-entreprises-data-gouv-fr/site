import fetchAnnoncesBodacc from '../clients/open-data-soft/bodacc';
import fetchAnnoncesJO from '../clients/open-data-soft/journal-officiel-associations';
import { Siren, verifySiren } from '../utils/helpers/siren-and-siret';
import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';
import { getUniteLegaleFromSlug } from './unite-legale';

export interface IAnnoncesBodacc {
  annonces: {
    titre: string;
    sousTitre: string;
    typeAvisLibelle: string;
    tribunal: string;
    numeroAnnonce: number;
    datePublication: string;
    details: string;
    path: string;
  }[];
  lastModified: string | null;
}

export interface IAnnoncesJO {
  annonces: {
    typeAvisLibelle: string;
    numeroParution: string;
    datePublication: string;
    details: string;
    path: string;
  }[];
  lastModified: string | null;
}

const getAnnoncesFromSlug = async (siren: string) => {
  const [uniteLegale, bodacc] = await Promise.all([
    getUniteLegaleFromSlug(siren),
    getAnnoncesBodaccFromSlug(siren),
  ]);

  let jo = null;
  if (uniteLegale.association && uniteLegale.association.id) {
    jo = await getAnnoncesJoFromIdRna(
      uniteLegale.association.id,
      uniteLegale.siren
    );
  }

  return {
    uniteLegale,
    bodacc,
    jo,
  };
};

const getAnnoncesJoFromIdRna = async (
  idRna: string,
  siren: Siren
): Promise<IAnnoncesJO | IAPINotRespondingError> => {
  try {
    return await fetchAnnoncesJO(idRna);
  } catch (e: any) {
    logErrorInSentry(new Error('Error in API Journal Officiel'), {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};

const getAnnoncesBodaccFromSlug = async (
  slug: string
): Promise<IAnnoncesBodacc | IAPINotRespondingError> => {
  const siren = verifySiren(slug);
  try {
    return await fetchAnnoncesBodacc(siren);
  } catch (e: any) {
    logErrorInSentry(new Error('Error in API BODACC'), {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};

export default getAnnoncesFromSlug;
