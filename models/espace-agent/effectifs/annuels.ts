import { clientApiEntrepriseEffectifsAnnuels } from "#clients/api-entreprise/effectifs/annuels";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import { verifySiren } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";

export type IEffectifsAnnuelsProtected = {
  effectif: number;
  anneeEffectif: string;
};

export const getEffectifsAnnuelsProtected = async (
  maybeSiren: string,
  scope: IAgentScope | null
): Promise<IEffectifsAnnuelsProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const effectifsAnnuelsYear =
    currentMonth === 0 ? currentYear - 2 : currentYear - 1;
  return clientApiEntrepriseEffectifsAnnuels(
    siren,
    effectifsAnnuelsYear,
    scope
  ).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: "EffectifsAnnuelsProtected",
    })
  );
};
