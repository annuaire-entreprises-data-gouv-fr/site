import { HttpNotFound } from "#/clients/exceptions";
import type { IFondation } from "#/models/core/fondations.types";
import { clientSearchFondationsRechercheEntreprise } from "./fondations.server";

export const clientFondationRechercheEntreprise = async (
  idRNF: string,
  pageEtablissements: number
): Promise<IFondation> => {
  const { results } = await clientSearchFondationsRechercheEntreprise({
    searchTerms: idRNF,
    pageResultatsRecherche: 1,
    pageEtablissements,
  });

  if (!(results.length && results[0])) {
    throw new HttpNotFound(idRNF);
  }
  return results[0];
};
