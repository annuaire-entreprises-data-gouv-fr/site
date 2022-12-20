import { clientEducationNationale } from '#clients/education-nationale';
import { HttpNotFound } from '#clients/exceptions';
import { clientRGE } from '#clients/rge';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { Siren, verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { getUniteLegaleFromSlug } from './unite-legale';

export interface IEducationNationaleEtablissement {
  libelleAcademie?: string | null;
  adresse?: string | null;
  codePostal?: string | null;
  nomCommune?: string | null;
  mail?: string | null;
  idEtablissement?: string | null;
  nombreEleves?: number | null;
  nomEtablissement?: string | null;
  siret?: string | null;
  statut?: string | null;
  telephone?: string | null;
  zone: string;
}

export const getUAI = async (
  slug: Siren
): Promise<IEducationNationaleEtablissement[] | IAPINotRespondingError> => {
  const siren = verifySiren(slug);
  try {
    return await clientEducationNationale(siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.EDUCATION_NATIONALE, 404);
    }
    logErrorInSentry('Error in API RGE', {
      siren: slug,
      details: e.toString(),
    });

    return APINotRespondingFactory(EAdministration.EDUCATION_NATIONALE, 500);
  }
};

export const getUaiFromSlug = async (slug: string) => {
  const siren = verifySiren(slug);
  const [uniteLegale, uai] = await Promise.all([
    getUniteLegaleFromSlug(slug),
    getUAI(siren),
  ]);

  return {
    uniteLegale,
    uai,
  };
};
