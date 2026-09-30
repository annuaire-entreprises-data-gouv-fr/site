import { httpGet } from "#/utils/network";
import routes from "../routes";
import type { IFondationResponse, IFondationResult } from "./interface";

export const clientSIAFFondation = async (
  idRNF: string
): Promise<IFondationResult> => {
  if (!process.env.SIAF_API_URL) {
    throw new Error("SIAF_API_URL is not set");
  }
  if (!process.env.SIAF_API_KEY) {
    throw new Error("SIAF_API_KEY is not set");
  }
  if (!process.env.SIAF_AUTHORIZATION_HEADER) {
    throw new Error("SIAF_AUTHORIZATION_HEADER is not set");
  }

  const url = `${process.env.SIAF_API_URL}${routes.siaf.getFondationById(idRNF)}`;

  const response = await httpGet<IFondationResponse>(url, {
    headers: {
      [process.env.SIAF_AUTHORIZATION_HEADER]: process.env.SIAF_API_KEY,
    },
  });

  return mapToDomainObject(response);
};

const mapToDomainObject = (response: IFondationResponse): IFondationResult => ({
  id: response.id,
  state: response.state,
  stateEffectiveAt: response.stateEffectiveAt,
  siret: response.siret,
  title: response.title,
  department: response.department,
  socialObject: response.socialObject,
  creationAt: response.creationAt,
  generalInterestDomain: response.generalInterestDomain,
  hasInternationalActivity: response.hasInternationalActivity,
  foundationType: response.foundationType,
  address: response.address,
});
