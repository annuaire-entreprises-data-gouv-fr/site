import { HttpNotFound } from '#clients/exceptions';
import { IEtablissement } from '#models/core/types';
import clientSearchRechercheEntreprise from '.';

export const clientEtablissementRechercheEntreprise = async (
  siret: string
): Promise<IEtablissement> => {
  const { results } = await clientSearchRechercheEntreprise({
    searchTerms: siret,
    pageResultatsRecherche: 1,
    inclureEtablissements: false,
    inclureImmatriculation: false,
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
