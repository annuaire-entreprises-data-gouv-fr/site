import { IUniteLegale, NotASirenError, SirenNotFoundError } from '.';
import { isSiren } from '../utils/helpers/siren-and-siret';
import getConventionCollectives, {
  IConventionCollective,
} from './convention-collective';
import getImmatriculations, { IImmatriculationLinks } from './immatriculation';
import getUniteLegale from './unite-legale';

export interface IJustificatifs {
  uniteLegale: IUniteLegale;
  conventionCollectives: IConventionCollective[];
  immatriculations: IImmatriculationLinks;
}

const getJustificatifs = async (siren: string): Promise<IJustificatifs> => {
  if (!isSiren(siren)) {
    throw new NotASirenError();
  }

  const uniteLegale = await getUniteLegale(siren as string);

  if (!uniteLegale) {
    throw new SirenNotFoundError(siren);
  }

  const justificatifs = await Promise.all([
    getConventionCollectives(uniteLegale as IUniteLegale),
    getImmatriculations(siren),
  ]);

  return {
    uniteLegale,
    conventionCollectives: justificatifs[0],
    immatriculations: justificatifs[1],
  };
};

export default getJustificatifs;
