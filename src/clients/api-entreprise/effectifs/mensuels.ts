import routes from "#/clients/routes";
import type { IAgentScope } from "#/models/authentication/agent/scopes/constants";
import type { IEffectifsMensuelsProtected } from "#/models/espace-agent/effectifs/mensuels";
import type { UseCase } from "#/models/use-cases";
import type { Siret } from "#/utils/helpers";
import clientAPIEntreprise from "../client";
import type {
  IAPIEntrepriseRcpEffectifsMensuels,
  TNatureEffectif,
} from "./types";

/**
 * GET effectifs from API Entreprise
 */
export async function clientApiEntrepriseEffectifsMensuels(
  siret: Siret,
  year: number,
  month: number,
  scope: IAgentScope | null,
  useCase: UseCase,
  filters: {
    profondeur: number;
    nature_effectif: TNatureEffectif;
  }
) {
  const formattedMonth = month < 10 ? `0${month}` : month.toString();

  return await clientAPIEntreprise<
    IAPIEntrepriseRcpEffectifsMensuels,
    IEffectifsMensuelsProtected
  >(
    `${routes.apiEntreprise.effectifs.mensuels(siret, year, formattedMonth)}?profondeur=${filters.profondeur}&nature_effectif=${filters.nature_effectif}`,
    (result) => mapToDomainObject(result),
    {
      scope,
      useCase,
    }
  );
}

const mapToDomainObject = ({
  data,
}: IAPIEntrepriseRcpEffectifsMensuels): IEffectifsMensuelsProtected => {
  const { effectifs_mensuels } = data;
  const mappedEffectifs = effectifs_mensuels
    .map((effectif) => {
      const date = new Date();
      date.setFullYear(+effectif.annee, +effectif.mois - 1, 1);

      return {
        date: date.toISOString(),
        nature: effectif.nature,
        value: effectif.value,
        regime: effectif.regime,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    effectifsRegimeGeneral: mappedEffectifs.filter(
      (effectif) => effectif.regime === "regime_general"
    ),
    effectifsRegimeAgricole: mappedEffectifs.filter(
      (effectif) => effectif.regime === "regime_agricole"
    ),
  };
};
