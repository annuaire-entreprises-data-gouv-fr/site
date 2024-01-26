import { HttpNotFound } from '#clients/exceptions';
import { IEtablissement } from '#models/index';
import clientSearchRechercheEntreprise from '.';

export const clientEtablissementRechercheEntreprise = async (
  siret: string,
  useCache = false
): Promise<IEtablissement> => {
  const { results } = await clientSearchRechercheEntreprise({
    searchTerms: siret,
    page: 1,
    useCache,
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
