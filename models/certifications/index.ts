import { IAPINotRespondingError } from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { verifySiren } from '#utils/helpers';
import { IUniteLegale } from '..';
import { getRGECertifications, IRGECertification } from './rge';

export * from './rge';

interface ICertifications {
  uniteLegale: IUniteLegale;
  rge: IRGECertification | IAPINotRespondingError;
}

export const getCertificationsFromSlug = async (
  slug: string
): Promise<ICertifications> => {
  const uniteLegale = await getUniteLegaleFromSlug(slug);
  const rge = await getRGECertifications(uniteLegale.siren);
  return { uniteLegale, rge };
};
