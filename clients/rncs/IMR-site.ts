import { Siren } from '../../utils/helpers/siren-and-siret';
import { httpGet } from '../../utils/network';
import routes from '../routes';
import parseSirenPageHtml from './IMR-site-parser';

export const fetchRNCSImmatriculationSiteFallback = async (siren: Siren) => {
  const response = await httpGet(routes.rncs.portail.entreprise + siren);
  return parseSirenPageHtml(response.data, siren);
};
