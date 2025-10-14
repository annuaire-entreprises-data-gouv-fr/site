import routes from "#clients/routes";
import type { Siret } from "#utils/helpers";
import clientAPIEntreprise from "./client";

export type IAPIEntrepriseEORIResponse = {
  data: {
    id: string;
    actif: boolean;
  };
};

export type IAPIEntrepriseEORI = {
  eori: string;
  isValid: boolean;
};

const mapToDomainObject = (
  response: IAPIEntrepriseEORIResponse
): IAPIEntrepriseEORI => ({
  eori: response.data.id,
  isValid: response.data.actif === true,
});

export const clientAPIEntrepriseEORI = (
  siret: Siret
): Promise<IAPIEntrepriseEORI> =>
  clientAPIEntreprise<IAPIEntrepriseEORIResponse, IAPIEntrepriseEORI>(
    routes.apiEntreprise.eori(siret),
    mapToDomainObject,
    { publicRequest: true }
  );
