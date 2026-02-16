import { clientApiEntrepriseDgfipLiassesFiscales } from "#clients/api-entreprise/liasses-fiscales";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#models/authentication/user/rights";
import type { UseCase } from "#models/use-cases";
import { verifySiren } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";

export type ILiassesFiscalesProtected = {
  obligationsFiscales: string[];
  declarations: {
    imprime: string;
    regime: any;
    dureeExercice: number;
    dateFinExercice: string;
    donnees: {
      intitule: string;
      valeurs: string[];
    }[];
  }[];
};

const scope = ApplicationRightsToScopes[ApplicationRights.liassesFiscales];

export const getLiassesFiscalesProtected = async (
  maybeSiren: string,
  params: { year?: string; useCase?: UseCase }
): Promise<ILiassesFiscalesProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseDgfipLiassesFiscales(
    siren,
    scope,
    params.year,
    params.useCase
  ).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: "getLiassesFiscalesProtected",
    })
  );
};
