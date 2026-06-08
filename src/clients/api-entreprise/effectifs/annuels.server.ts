import routes from "#/clients/routes";
import type { IAgentScope } from "#/models/authentication/agent/scopes/constants";
import type { IEffectifsAnnuelsProtected } from "#/models/espace-agent/effectifs/annuels";
import type { UseCase } from "#/models/use-cases";
import type { Siren } from "#/utils/helpers";
import clientAPIEntreprise from "../client.server";
import type {
  IAPIEntrepriseRcpEffectifsAnnuels,
  TNatureEffectif,
} from "./types";

/**
 * GET effectifs from API Entreprise
 */
export async function clientApiEntrepriseEffectifsAnnuels(
  siren: Siren,
  year: number,
  scope: IAgentScope | null,
  useCase: UseCase,
  filters: {
    nature_effectif: TNatureEffectif;
  }
) {
  return await clientAPIEntreprise<
    IAPIEntrepriseRcpEffectifsAnnuels,
    IEffectifsAnnuelsProtected
  >(
    `${routes.apiEntreprise.effectifs.annuels(siren, year)}?nature_effectif=${filters.nature_effectif}`,
    mapToDomainObject,
    {
      scope,
      useCase,
    }
  );
}

const mapToDomainObject = ({
  data: { effectifs_annuel, annee },
}: IAPIEntrepriseRcpEffectifsAnnuels): IEffectifsAnnuelsProtected => {
  const mappedEffectifs = effectifs_annuel.map((effectif) => ({
    nature: effectif.nature,
    value: effectif.value,
    regime: effectif.regime,
  }));

  return {
    effectifsRegimeGeneral: mappedEffectifs.filter(
      (effectif) => effectif.regime === "regime_general"
    ),
    effectifsRegimeAgricole: mappedEffectifs.filter(
      (effectif) => effectif.regime === "regime_agricole"
    ),
    anneeEffectif: annee,
  };
};
