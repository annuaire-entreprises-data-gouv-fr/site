import { getUniteLegaleInsee } from '../clients/sirene-insee/siren';

/**
 * Download Unite Legale from Etalab SIRENE API (fallback on INSEE's API)
 * @param siren
 */
const getUniteLegale = async (siren: string) => {
  const uniteLegale = await getUniteLegaleSireneOuverte(siren);

  if (!uniteLegale) {
    return await getUniteLegaleInsee(siren);
  }
  return uniteLegale;
};

export default getUniteLegale;
