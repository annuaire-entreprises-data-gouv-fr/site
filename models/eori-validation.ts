import { clientAPIEntrepriseEORI } from "#clients/api-entreprise/eori";
import { verifySiret } from "#utils/helpers";
import logErrorInSentry from "#utils/sentry";
import { EAdministration } from "./administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "./api-not-responding";
import { FetchRessourceException } from "./exceptions";

export type IEORIValidation = {
  eori: string;
  isValid: boolean;
};

export const getEORIValidation = async (
  siret: string
): Promise<IEORIValidation | IAPINotRespondingError> => {
  try {
    const verifiedSiret = verifySiret(siret);
    const data = await clientAPIEntrepriseEORI(verifiedSiret);
    if (!data) {
      throw new Error("API Entreprise EORI response is empty");
    }
    return data;
  } catch (e: any) {
    logErrorInSentry(
      new FetchRessourceException({
        ressource: "EORIValidation",
        cause: e,
        context: { siret },
      })
    );
    return APINotRespondingFactory(EAdministration.DOUANES, e.status || 500);
  }
};
