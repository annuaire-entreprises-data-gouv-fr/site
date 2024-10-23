import { HttpNotFound } from '#clients/exceptions';
import { IUniteLegale } from '#models/core/types';
import { Siren } from '#utils/helpers';
import clientSearchRechercheEntreprise from '.';

export const clientUniteLegaleRechercheEntreprise = async (
  siren: Siren,
  pageEtablissements: number
): Promise<IUniteLegale> => {
  const { results } = await clientSearchRechercheEntreprise({
    searchTerms: siren,
    pageResultatsRecherche: 1,
    inclureEtablissements: true,
    inclureImmatriculation: true,
    pageEtablissements,
  });

  if (!results.length || !results[0]) {
    throw new HttpNotFound(siren);
  }
  return results[0];
};
