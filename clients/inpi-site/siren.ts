import { IImmatriculationRNCSPartial } from '../../models/immatriculation';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { httpGet } from '../../utils/network';
import routes from '../routes';

export const fetchImmatriculationRNCSFromSiren = async (
  siren: Siren
): Promise<IImmatriculationRNCSPartial> => {
  await httpGet(routes.rncs.portail.entreprise + siren);
  return mapToDomainObject(siren);
};

const mapToDomainObject = (siren: Siren): IImmatriculationRNCSPartial => {
  return {
    siren,
    downloadlink: routes.rncs.portail.entreprise + siren,
    rncsIncomplet: true,
  };
};
