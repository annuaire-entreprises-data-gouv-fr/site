import clientSearchSireneOuverte from '.';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { HttpNotFound } from '../exceptions';

const clientComplementsSireneOuverte = async (siren: Siren) => {
  const { results } = await clientSearchSireneOuverte(siren, 1);
  if (results.length > 0) {
    const { complements, colter, dirigeants } = results[0];
    return { complements, colter, dirigeants };
  }
  throw new HttpNotFound(siren);
};

export default clientComplementsSireneOuverte;
