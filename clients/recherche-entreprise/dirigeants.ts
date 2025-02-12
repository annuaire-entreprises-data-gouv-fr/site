import { IDirigeants } from '#models/rne/types';
import { Siren } from '#utils/helpers';
import clientSearchRechercheEntreprise from '.';

export const clientDirigeantsRechercheEntreprise = async (
  siren: Siren
): Promise<IDirigeants> => {
  const { results } = await clientSearchRechercheEntreprise({
    searchTerms: siren,
    pageResultatsRecherche: 1,
    inclureEtablissements: false,
    inclureImmatriculation: false,
    pageEtablissements: 1,
  });

  if (!results.length || !results[0]) {
    return [];
  }

  return results[0].dirigeants || [];
};
