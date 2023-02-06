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

export interface IEtablissementsScolaires {
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

export const getEtablissementsScolaires = async (
  siren: Siren,
  page: number
): Promise<IEtablissementsScolaires | IAPINotRespondingError> => {
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

export const getEtablissementsScolairesFromSlug = async (
  slug: string,
  page: number
) => {
  const siren = verifySiren(slug);
  const [uniteLegale, etablissementsScolaires] = await Promise.all([
    getUniteLegaleFromSlug(siren),
    getEtablissementsScolaires(siren, page),
  ]);

  return {
    uniteLegale,
    etablissementsScolaires,
  };
};
