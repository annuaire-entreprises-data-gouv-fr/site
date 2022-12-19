import { IAPINotRespondingError } from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { IUniteLegale } from '..';
import {
  getEntrepreneurSpectaclesCertification,
  IEntrepreneurSpectaclesCertification,
} from './entrepreneur-spectacles';
import { getRGECertifications, IRGECertification } from './rge';

export interface ICertifications {
  uniteLegale: IUniteLegale;
  rge: IRGECertification | IAPINotRespondingError;
  entrepreneurSpectacles:
    | IEntrepreneurSpectaclesCertification
    | IAPINotRespondingError;
}

export const getCertificationsFromSlug = async (
  slug: string
): Promise<ICertifications> => {
  const uniteLegale = await getUniteLegaleFromSlug(slug);

  const [rge, entrepreneurSpectacles] = await Promise.all([
    getRGECertifications(uniteLegale),
    getEntrepreneurSpectaclesCertification(uniteLegale),
  ]);

  return {
    uniteLegale,
    rge,
    entrepreneurSpectacles,
  };
};
