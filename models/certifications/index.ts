import { IAPINotRespondingError } from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { IUniteLegale } from '..';
import { getBio } from './bio';
import {
  getEntrepreneurSpectaclesCertification,
  IEntrepreneurSpectaclesCertification,
} from './entrepreneur-spectacles';
import { getRGECertifications, IRGECertification } from './rge';

export interface ICertifications {
  uniteLegale: IUniteLegale;
  bio: any;
  rge: IRGECertification | IAPINotRespondingError;
  entrepreneurSpectacles:
    | IEntrepreneurSpectaclesCertification
    | IAPINotRespondingError;
}

export const getCertificationsFromSlug = async (
  slug: string
): Promise<ICertifications> => {
  const uniteLegale = await getUniteLegaleFromSlug(slug);

  const [rge, entrepreneurSpectacles, bio] = await Promise.all([
    getRGECertifications(uniteLegale),
    getEntrepreneurSpectaclesCertification(uniteLegale),
    getBio(uniteLegale),
  ]);

  return {
    bio,
    uniteLegale,
    rge,
    entrepreneurSpectacles,
  };
};
