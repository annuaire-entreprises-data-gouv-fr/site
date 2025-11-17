import routes from "#clients/routes";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { IEffectifsAnnuelsProtected } from "#models/espace-agent/effectifs/annuels";
import type { Siren } from "#utils/helpers";
import clientAPIEntreprise from "../client";
import type { IAPIEntrepriseRcpEffectifsAnnuels } from "./types";

/**
 * GET effectifs from API Entreprise
 */
export async function clientApiEntrepriseEffectifsAnnuels(
  siren: Siren,
  year: number,
  scope: IAgentScope | null
) {
  return await clientAPIEntreprise<
    IAPIEntrepriseRcpEffectifsAnnuels,
    IEffectifsAnnuelsProtected
  >(routes.apiEntreprise.effectifs.annuels(siren, year), mapToDomainObject, {
    scope,
  });
}

const mapToDomainObject = ({
  data: { effectifs_annuel, annee },
}: IAPIEntrepriseRcpEffectifsAnnuels): IEffectifsAnnuelsProtected => {
  const trancheEffectif = effectifs_annuel.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  return {
    effectif: trancheEffectif, // can be a float
    anneeEffectif: annee,
  };
};
