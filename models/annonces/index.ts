import {
  clientDCA,
  clientJOAFE,
} from '#clients/open-data-soft/clients/journal-officiel-associations';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { IdRna, Siren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { isAssociation } from '..';

export interface IComptesAssociation {
  comptes: {
    dateparution: string;
    numeroParution: string;
    datecloture: string;
    permalinkUrl: string;
    anneeCloture: string;
  }[];
  lastModified: string | null;
}

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
  procedures: {
    date: string;
    details: string;
  }[];
}

export interface IAnnoncesAssociation {
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
  const [uniteLegale] = await Promise.all([getUniteLegaleFromSlug(siren, {})]);

  let annoncesAssociation = null;
  let comptesAssociation = null;

  if (isAssociation(uniteLegale)) {
    [annoncesAssociation, comptesAssociation] = await Promise.all([
      getAnnoncesAssociation(
        uniteLegale.association.idAssociation,
        uniteLegale.siren
      ),
      getComptesAssociation(
        uniteLegale.siren,
        uniteLegale.association.idAssociation
      ),
    ]);
  }

  return {
    annoncesAssociation,
    comptesAssociation,
    uniteLegale,
  };
};

const getComptesAssociation = async (
  siren: Siren,
  idRna: IdRna | string
): Promise<IComptesAssociation | IAPINotRespondingError> => {
  try {
    return await clientDCA(siren, idRna);
  } catch (e: any) {
    logErrorInSentry('Error in API JOAFE : COMPTES', {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};

const getAnnoncesAssociation = async (
  idRna: string,
  siren: Siren
): Promise<IAnnoncesAssociation | IAPINotRespondingError> => {
  try {
    return await clientJOAFE(idRna);
  } catch (e: any) {
    logErrorInSentry('Error in API JOAFE: ANNONCES', {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.DILA, 500);
  }
};

export { getAnnoncesFromSlug };
