import type { IDirigeants } from "#models/rne/types";
import type { Siren } from "#utils/helpers";
import clientSearchRechercheEntreprise from ".";

export const clientDirigeantsRechercheEntreprise = async (
  siren: Siren,
  signal?: AbortSignal
): Promise<IDirigeants> => {
  const { results } = await clientSearchRechercheEntreprise(
    {
      searchTerms: siren,
      pageResultatsRecherche: 1,
      inclureEtablissements: false,
      inclureImmatriculation: false,
      pageEtablissements: 1,
    },
    signal
  );

  if (!results.length || !results[0]) {
    return [];
  }

  return results[0].dirigeants || [];
};
