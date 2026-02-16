import { clientApiEntrepriseChiffreAffaires } from "#clients/api-entreprise/chiffres-affaires";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#models/authentication/user/rights";
import type { UseCase } from "#models/use-cases";
import { verifySiret } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";

export type IChiffreAffairesProtected = {
  chiffreAffaires: number;
  dateFinExercice: string;
  year: number;
}[];

const scope = ApplicationRightsToScopes[ApplicationRights.chiffreAffaires];

export const getChiffreAffairesProtected = async (
  maybeSiret: string,
  params: { useCase?: UseCase }
): Promise<IChiffreAffairesProtected | IAPINotRespondingError> => {
  const siret = verifySiret(maybeSiret);
  return clientApiEntrepriseChiffreAffaires(siret, scope, params.useCase).catch(
    (error) =>
      handleApiEntrepriseError(error, {
        siret,
        apiResource: "ChiffreAffairesProtected",
      })
  );
};
