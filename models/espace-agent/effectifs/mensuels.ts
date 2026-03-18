import { clientApiEntrepriseEffectifsMensuels } from "#clients/api-entreprise/effectifs/mensuels";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#models/authentication/user/rights";
import { verifySiret } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";

export interface IEffectifsMensuelsProtected {
  anneeEffectif: string;
  effectif: number;
  moisEffectif: string;
}

export const getEffectifsMensuelsProtected = async (
  maybeSiret: string
): Promise<IEffectifsMensuelsProtected | IAPINotRespondingError> => {
  const siret = verifySiret(maybeSiret);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const twoMonthsAgo = currentMonth - 2;

  // We need to retrieve the effectifs of two months ago because
  // the effectifs of the previous month are available on the last day of the current month
  const effectifsMensuelsMonth =
    twoMonthsAgo > 0 ? twoMonthsAgo : 12 + twoMonthsAgo;
  const effectifsMensuelsYear =
    effectifsMensuelsMonth === 0 ? currentYear - 2 : currentYear - 1;
  return clientApiEntrepriseEffectifsMensuels(
    siret,
    effectifsMensuelsYear,
    effectifsMensuelsMonth,
    ApplicationRightsToScopes[ApplicationRights.effectifs]
  ).catch((error) => {
    return handleApiEntrepriseError(error, {
      siret,
      apiResource: "EffectifsMensuelsProtected",
    });
  });
};
