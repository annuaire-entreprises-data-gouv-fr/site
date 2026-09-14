import { clientEntrepreneursSpectacles } from "#/clients/api-data-gouv/entrepreneurs-spectacles";
import type { IEntrepreneursSpectacles } from "#/clients/api-data-gouv/entrepreneurs-spectacles/interface";
import type { IAPINotRespondingError } from "#/models/api-not-responding";
import { getEgapro, type IEgapro } from "#/models/certifications/egapro";
import type { Siren } from "#/utils/helpers";
import type { IUniteLegaleComplements } from "../core/types";
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
  bio: IEtablissementsBio | IAPINotRespondingError;
  egapro: IEgapro | IAPINotRespondingError;
  entrepreneurSpectacles: IEntrepreneursSpectacles | IAPINotRespondingError;
  entrepriseInclusive: IEntrepriseInclusive[] | IAPINotRespondingError;
  ess: IESS | IAPINotRespondingError;
  organismesDeFormation: IOrganismeFormation | IAPINotRespondingError;
  rge: IRGECertification | IAPINotRespondingError;
}

export const getCertificationsFromSlug = async (
  siren: Siren,
  complements: Pick<
    IUniteLegaleComplements,
    | "egaproRenseignee"
    | "estBio"
    | "estEntrepreneurSpectacle"
    | "estEntrepriseInclusive"
    | "estEss"
    | "estOrganismeFormation"
    | "estRge"
  >,
  options?: { entrepreneurSpectaclesPage?: number }
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
    getRGECertifications(siren, complements.estRge),
    clientEntrepreneursSpectacles(
      siren,
      complements.estEntrepreneurSpectacle,
      options?.entrepreneurSpectaclesPage
    ),
    getBio(siren, complements.estBio),
    getEgapro(siren, complements.egaproRenseignee),
    getOrganismesDeFormation(siren, complements.estOrganismeFormation),
    getEss(siren, complements.estEss),
    getEntrepriseInclusive(siren, complements.estEntrepriseInclusive),
  ]);

  return {
    bio,
    egapro,
    rge,
    entrepreneurSpectacles,
    organismesDeFormation,
    ess,
    entrepriseInclusive,
  };
};
