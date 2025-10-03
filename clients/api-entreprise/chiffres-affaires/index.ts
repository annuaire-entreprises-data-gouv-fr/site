import routes from "#clients/routes";
import type { IChiffreAffairesProtected } from "#models/espace-agent/chiffre-affaires";
import type { UseCase } from "#models/use-cases";
import type { Siret } from "#utils/helpers";
import { getFiscalYear } from "#utils/helpers/formatting/format-fiscal-year";
import clientAPIEntreprise from "../client";
import type { IAPIEntrepriseChiffreAffaires } from "./types";

/**
 * GET CA from API Entreprise
 */
export async function clientApiEntrepriseChiffreAffaires(
  siret: Siret,
  useCase?: UseCase
) {
  return await clientAPIEntreprise<
    IAPIEntrepriseChiffreAffaires,
    IChiffreAffairesProtected
  >(routes.apiEntreprise.dgfip.chiffreAffaires(siret), mapToDomainObject, {
    useCase,
  });
}

const mapToDomainObject = (
  response: IAPIEntrepriseChiffreAffaires
): IChiffreAffairesProtected =>
  response.data
    .map(({ data }) => ({
      chiffreAffaires: data.chiffre_affaires,
      dateFinExercice: data.date_fin_exercice,
      year: getFiscalYear(data.date_fin_exercice),
    }))
    .sort((a, b) => a.year - b.year);
