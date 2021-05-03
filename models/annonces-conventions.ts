import { IUniteLegale, NotASirenError } from '.';
import { isSiren } from '../utils/helpers/siren-and-siret';
import getConventionCollectives, {
  IConventionCollective,
} from './convention-collective';

import getUniteLegale from './unite-legale';

export interface IConventions {
  uniteLegale: IUniteLegale;
  conventionCollectives: IConventionCollective[];
}

const getConventions = async (siren: string): Promise<IConventions> => {
  if (!isSiren(siren)) {
    throw new NotASirenError(`${siren} is not a valid siren`);
  }

  const uniteLegale = await getUniteLegale(siren as string);

  const conventions = uniteLegale.estDiffusible
    ? await getConventionCollectives(uniteLegale as IUniteLegale)
    : [];

  return {
    uniteLegale,
    conventionCollectives: conventions,
  };
};

export default getConventions;
