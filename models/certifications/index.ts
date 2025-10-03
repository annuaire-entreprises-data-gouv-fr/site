import type { IAPINotRespondingError } from "#models/api-not-responding";
import { getEgapro, type IEgapro } from "#models/certifications/egapro";
import type { IUniteLegale } from "../core/types";
import { getBio, type IEtablissementsBio } from "./bio";
import {
  getEntrepreneurSpectaclesCertification,
  type IEntrepreneurSpectaclesCertification,
} from "./entrepreneur-spectacles";
import {
  getEntrepriseInclusive,
  type IEntrepriseInclusive,
} from "./entreprise-inclusive";
import { getEss, type IESS } from "./ess";
import {
  getOrganismesDeFormation,
  type IOrganismeFormation,
} from "./organismes-de-formation";
import { getRGECertifications, type IRGECertification } from "./rge";

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
  uniteLegale: IUniteLegale
): Promise<ICertifications> => {
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
