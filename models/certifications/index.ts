import { IAPINotRespondingError } from '#models/api-not-responding';
import { getEgapro, IEgapro } from '#models/certifications/egapro';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { IUniteLegale } from '..';
import { getBio, IEtablissementsBio } from './bio';
import {
  getEgaproRepresentation,
  IEgaproRepresentation,
} from './egapro-respresentation-equilibre';
import {
  getEntrepreneurSpectaclesCertification,
  IEntrepreneurSpectaclesCertification,
} from './entrepreneur-spectacles';
import { getRGECertifications, IRGECertification } from './rge';

export interface ICertifications {
  uniteLegale: IUniteLegale;
  bio: IEtablissementsBio | IAPINotRespondingError;
  rge: IRGECertification | IAPINotRespondingError;
  entrepreneurSpectacles:
    | IEntrepreneurSpectaclesCertification
    | IAPINotRespondingError;
  egapro: IEgapro | IAPINotRespondingError;
  egaproRepresentation: IEgaproRepresentation | IAPINotRespondingError;
}

export const getCertificationsFromSlug = async (
  slug: string
): Promise<ICertifications> => {
  const uniteLegale = await getUniteLegaleFromSlug(slug);

  const [rge, entrepreneurSpectacles, bio, egapro, egaproRepresentation] =
    await Promise.all([
      getRGECertifications(uniteLegale),
      getEntrepreneurSpectaclesCertification(uniteLegale),
      getBio(uniteLegale),
      getEgapro(uniteLegale),
      getEgaproRepresentation(uniteLegale),
    ]);

  return {
    bio,
    egapro,
    egaproRepresentation,
    uniteLegale,
    rge,
    entrepreneurSpectacles,
  };
};
