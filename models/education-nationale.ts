import { clientEducationNationale } from '#clients/education-nationale';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { Siren, verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { getUniteLegaleFromSlug } from './unite-legale';

export interface IEducationNationaleEtablissement {
  currentPage: number;
  resultCount: number;
  pageCount: number;
  results: {
    adresse: string;
    codePostal: string;
    idEtablissement: string;
    libelleAcademie: string;
    mail: string;
    nombreEleves: number;
    nomCommune: string;
    nomEtablissement: string;
    siret: string;
    statut: string;
    telephone: string;
    uai: string;
    zone: string;
  }[];
}

export const getUAI = async (
  siren: Siren,
  page: number
): Promise<IEducationNationaleEtablissement | IAPINotRespondingError> => {
  try {
    return await clientEducationNationale(siren, page);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.EDUCATION_NATIONALE, 404);
    }
    logErrorInSentry('Error in API Education nationale', {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.EDUCATION_NATIONALE, 500);
  }
};

export const getUaiFromSlug = async (slug: string, page: number) => {
  const siren = verifySiren(slug);
  const [uniteLegale, uai] = await Promise.all([
    getUniteLegaleFromSlug(siren),
    getUAI(siren, page),
  ]);

  return {
    uniteLegale,
    uai,
  };
};
