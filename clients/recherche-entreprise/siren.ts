import { HttpNotFound } from '#clients/exceptions';
import { IUniteLegale } from '#models/index';
import { Siren } from '#utils/helpers';
import clientSearchSireneOuverte from '.';

export const clientUniteLegaleSireneOuverte = async (
  siren: Siren,
  fallbackOnStaging = false
): Promise<IUniteLegale> => {
  const { results } = await clientSearchSireneOuverte({
    searchTerms: siren,
    page: 1,
    inclureEtablissements: true,
    fallbackOnStaging,
  });
  if (!results.length || !results[0]) {
    throw new HttpNotFound(siren);
  }
  return results[0];
};
