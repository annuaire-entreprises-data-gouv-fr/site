import { clientEducationNationale } from '#clients/education-nationale';
import { HttpNotFound } from '#clients/exceptions';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { Siren, verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { EAdministration } from './administrations/EAdministration';
import { FetchRessourceException } from './exceptions';
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
    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'EtablissementsScolaires',
        cause: e,
        context: {
          siren,
        },
        administration: EAdministration.EDUCATION_NATIONALE,
      })
    );
    return APINotRespondingFactory(EAdministration.EDUCATION_NATIONALE, 500);
  }
};

export const getEtablissementsScolairesFromSlug = async (
  slug: string,
  page: number,
  isBot: boolean
) => {
  const siren = verifySiren(slug);
  const [uniteLegale, etablissementsScolaires] = await Promise.all([
    getUniteLegaleFromSlug(siren, { isBot }),
    getEtablissementsScolaires(siren, page),
  ]);

  return {
    uniteLegale,
    etablissementsScolaires,
  };
};
