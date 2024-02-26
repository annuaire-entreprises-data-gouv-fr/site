import { IAPINotRespondingError } from '#models/api-not-responding';
import { getEgapro, IEgapro } from '#models/certifications/egapro';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { IUniteLegale } from '../core/types';
import { getBio, IEtablissementsBio } from './bio';
import {
  getEntrepreneurSpectaclesCertification,
  IEntrepreneurSpectaclesCertification,
} from './entrepreneur-spectacles';
import {
  getEntrepriseInclusive,
  IEntrepriseInclusive,
} from './entreprise-inclusive';
import { getEss, IESS } from './ess';
import {
  getOrganismesDeFormation,
  IOrganismeFormation,
} from './organismes-de-formation';
import { getRGECertifications, IRGECertification } from './rge';

export interface ICertifications {
  uniteLegale: IUniteLegale;
  bio: IEtablissementsBio | IAPINotRespondingError;
  rge: IRGECertification | IAPINotRespondingError;
  entrepreneurSpectacles:
    | IEntrepreneurSpectaclesCertification
    | IAPINotRespondingError;
  egapro: IEgapro | IAPINotRespondingError;
  organismesDeFormation: IOrganismeFormation | IAPINotRespondingError;
  ess: IESS | IAPINotRespondingError;
  entrepriseInclusive: IEntrepriseInclusive[] | IAPINotRespondingError;
}

export const getCertificationsFromSlug = async (
  slug: string,
  isBot: boolean
): Promise<ICertifications> => {
  const uniteLegale = await getUniteLegaleFromSlug(slug, { isBot });

  const [
    rge,
    entrepreneurSpectacles,
    bio,
    egapro,
    organismesDeFormation,
    ess,
    entrepriseInclusive,
  ] = await Promise.all([
    getRGECertifications(uniteLegale),
    getEntrepreneurSpectaclesCertification(uniteLegale),
    getBio(uniteLegale),
    getEgapro(uniteLegale),
    getOrganismesDeFormation(uniteLegale),
    getEss(uniteLegale),
    getEntrepriseInclusive(uniteLegale),
  ]);

  return {
    bio,
    egapro,
    uniteLegale,
    rge,
    entrepreneurSpectacles,
    organismesDeFormation,
    ess,
    entrepriseInclusive,
  };
};
