import getResults from '.';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { HttpNotFound } from '../exceptions';

const getUniteLegaleComplements = async (siren: Siren) => {
  const { results } = await getResults(siren, 1);
  if (results.length > 0) {
    const { complements, colter, dirigeants } = results[0];
    return { complements, colter, dirigeants };
  }
  throw new HttpNotFound(siren);
};

export default getUniteLegaleComplements;
