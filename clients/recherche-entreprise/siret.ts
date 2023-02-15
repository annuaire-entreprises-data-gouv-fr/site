import { HttpNotFound } from '#clients/exceptions';
import { IEtablissement } from '#models/index';
import clientSearchSireneOuverte from '.';

export const clientEtablissementSireneOuverte = async (
  siret: string
): Promise<IEtablissement> => {
  const { results } = await clientSearchSireneOuverte({
    searchTerms: siret,
    page: 1,
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
