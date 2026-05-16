import { HttpNotFound } from "#/clients/exceptions";
import type { IEtablissement } from "#/models/core/types";
import clientSearchRechercheEntreprise from "./index.server";

export const clientEtablissementRechercheEntreprise = async (
  siret: string
): Promise<IEtablissement> => {
  const { results } = await clientSearchRechercheEntreprise({
    searchTerms: siret,
    pageResultatsRecherche: 1,
    inclureEtablissements: false,
    inclureImmatriculation: false,
    inclureTVA: false,
    inclureBodacc: false,
  });

  if (
    !results.length ||
    !results[0] ||
    results[0].matchingEtablissements.length === 0
  ) {
    throw new HttpNotFound(siret);
  }

  const result = results[0];
  return result.matchingEtablissements[0];
};
