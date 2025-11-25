import { clientEntrepreneursSpectacles } from "#clients/api-data-gouv/entrepreneurs-spectacles";
import type { IEntrepreneursSpectacles } from "#clients/api-data-gouv/entrepreneurs-spectacles/interface";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import { getEgapro, type IEgapro } from "#models/certifications/egapro";
import type { IUniteLegale } from "../core/types";
import { getBio, type IEtablissementsBio } from "./bio";
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
  entrepreneurSpectacles: IEntrepreneursSpectacles | IAPINotRespondingError;
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
    clientEntrepreneursSpectacles(uniteLegale),
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
