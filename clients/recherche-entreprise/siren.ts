import { HttpNotFound } from '#clients/exceptions';
import { IUniteLegaleComplements } from '#models/unite-legale-complements';
import { Siren } from '#utils/helpers';
import clientSearchSireneOuverte from '.';

const clientComplementsSireneOuverte = async (
  siren: Siren
): Promise<IUniteLegaleComplements> => {
  const { results } = await clientSearchSireneOuverte(siren, 1);
  if (results.length > 0) {
    const { complements, colter } = results[0];
    return { complements, colter };
  }
  throw new HttpNotFound(siren);
};

export default clientComplementsSireneOuverte;
