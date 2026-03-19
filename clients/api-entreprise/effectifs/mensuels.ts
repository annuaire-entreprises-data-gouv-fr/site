import routes from "#clients/routes";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { IEffectifsMensuelsProtected } from "#models/espace-agent/effectifs/mensuels";
import type { Siret } from "#utils/helpers";
import clientAPIEntreprise from "../client";
import type { IAPIEntrepriseRcpEffectifsMensuels } from "./types";

/**
 * GET effectifs from API Entreprise
 */
export async function clientApiEntrepriseEffectifsMensuels(
  siret: Siret,
  year: number,
  month: number,
  scope: IAgentScope | null
) {
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  return await clientAPIEntreprise<
    IAPIEntrepriseRcpEffectifsMensuels,
    IEffectifsMensuelsProtected
  >(
    routes.apiEntreprise.effectifs.mensuels(siret, year, formattedMonth),
    (result) =>
      mapToDomainObject(result, {
        year: year.toString(),
        month: formattedMonth,
      }),
    {
      scope,
    }
  );
}

const mapToDomainObject = (
  { data }: IAPIEntrepriseRcpEffectifsMensuels,
  { year, month }: { year: string; month: string }
): IEffectifsMensuelsProtected => {
  const { effectifs_mensuels } = data;
  const trancheEffectif = effectifs_mensuels.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  return {
    effectif: trancheEffectif, // can be a float
    anneeEffectif: effectifs_mensuels[0]?.annee ?? year,
    moisEffectif: effectifs_mensuels[0]?.mois ?? month,
  };
};
