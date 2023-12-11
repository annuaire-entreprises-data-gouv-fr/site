import { HttpNotFound } from '#clients/exceptions';
import { IUniteLegale } from '#models/index';
import { Siren } from '#utils/helpers';
import clientSearchRechercheEntreprise from '.';

export const clientUniteLegaleRechercheEntreprise = async (
  siren: Siren,
  pageEtablissements: number,
  fallbackOnStaging = false,
  useCache = false
): Promise<IUniteLegale> => {
  const { results } = await clientSearchRechercheEntreprise({
    searchTerms: siren,
    page: 1,
    inclureEtablissements: true,
    pageEtablissements,
    useCache,
    fallbackOnStaging,
  });

  if (!results.length || !results[0]) {
    throw new HttpNotFound(siren);
  }
  return results[0];
};
