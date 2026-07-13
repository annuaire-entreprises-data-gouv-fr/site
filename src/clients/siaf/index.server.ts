import { httpGet } from "#/utils/network";
import routes from "../routes";
import type { IFondation, IFondationResponse } from "./interface";

export const clientSIAFFondation = async (
  idRNF: string
): Promise<IFondation> => {
  const response = await httpGet<IFondationResponse>(
    routes.siaf.getFondationById(idRNF),
    {
      headers: {
        "x-api-key": process.env.SIAF_API_KEY,
      },
    }
  );

  return mapToDomainObject(response);
};

const mapToDomainObject = (response: IFondationResponse): IFondation => ({
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
