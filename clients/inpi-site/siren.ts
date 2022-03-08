import { IImmatriculationRNCS } from '../../models/immatriculation';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { httpGet } from '../../utils/network';
import routes from '../routes';
import parseSirenPageHtml from './parsers/siren-parser';

export const fetchRNCSImmatriculationSiteFallback = async (
  siren: Siren
): Promise<IImmatriculationRNCS> => {
  const response = await httpGet(routes.rncs.portail.entreprise + siren);
  return mapToDomainObject(response.data, siren);
};

const mapToDomainObject = (
  html: string,
  siren: Siren
): IImmatriculationRNCS => {
  return {
    ...parseSirenPageHtml(html, siren),
    siren,
    downloadlink: routes.rncs.portail.entreprise + siren,
  };
};
