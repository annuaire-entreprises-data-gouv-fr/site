import { IImmatriculationRNCSCore } from '../../../models/immatriculation/rncs';
import { Siren } from '../../../utils/helpers/siren-and-siret';
import { httpGet } from '../../../utils/network';
import routes from '../../routes';
import { extractIMRFromHtml } from './IMR-parser';

export const fetchRNCSImmatriculationFromSite = async (
  siren: Siren
): Promise<IImmatriculationRNCSCore> => {
  const response = await httpGet(routes.rncs.portail.entreprise + siren);

  return {
    ...extractIMRFromHtml(response.data, siren),
    metadata: {
      isFallback: true,
    },
  };
};
