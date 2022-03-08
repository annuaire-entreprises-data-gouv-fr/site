import { fetchRNCSIMR } from '.';
import { IIdentite } from '../../models/dirigeants';
import { IImmatriculationRNCS } from '../../models/immatriculation';
import { Siren } from '../../utils/helpers/siren-and-siret';
import routes from '../routes';

/**
 * Checks if justificatifs exists in RNCS and  parses html response
 * @param siren
 * @returns
 */
export const fetchRNCSImmatriculation = async (
  siren: Siren
): Promise<IImmatriculationRNCS> => {
  const { identite } = await fetchRNCSIMR(siren);

  return mapToDomainObject(siren, identite);
};

const mapToDomainObject = (
  siren: Siren,
  apiRNCSResponse: IIdentite
): IImmatriculationRNCS => {
  return {
    ...apiRNCSResponse,
    siren,
    downloadlink: routes.rncs.portail.entreprise + siren,
  };
};
