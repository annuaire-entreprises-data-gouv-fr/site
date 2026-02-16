import { clientApiEntrepriseLiensCapitalistiques } from "#clients/api-entreprise/liens-capitalistiques";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#models/authentication/user/rights";
import type {
  IEtatCivilLiensCapitalistiques,
  IPersonneMoraleLiensCapitalistiques,
} from "#models/rne/types";
import type { UseCase } from "#models/use-cases";
import { verifySiren } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";

export type ILiensCapitalistiquesProtected = {
  actionnaires: Array<
    IPersonneMoraleLiensCapitalistiques | IEtatCivilLiensCapitalistiques
  >;
  filiales: Array<IPersonneMoraleLiensCapitalistiques>;
};

const scope = ApplicationRightsToScopes[ApplicationRights.liensCapitalistiques];

export const getLiensCapitalistiquesProtected = async (
  maybeSiren: string,
  params: { year?: string; useCase?: UseCase }
): Promise<ILiensCapitalistiquesProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseLiensCapitalistiques(
    siren,
    scope,
    params.year,
    params.useCase
  ).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: "LiensCapitalistiquesProtected",
    })
  );
};
