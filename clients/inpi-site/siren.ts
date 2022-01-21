import { IImmatriculationRNCS } from '../../models/immatriculation';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { httpGet } from '../../utils/network';
import routes from '../routes';

export const fetchRNCSImmatriculationSiteFallback = async (
  siren: Siren
): Promise<IImmatriculationRNCS> => {
  await httpGet(routes.rncs.portail.entreprise + siren);
  return mapToDomainObject(siren);
};

const mapToDomainObject = (siren: Siren): IImmatriculationRNCS => {
  return {
    siren,
    downloadlink: routes.rncs.portail.entreprise + siren,
    denomination: '',
    codeGreffe: '',
    greffe: '',
    numeroRCS: '',
    numGestion: '',
    dateGreffe: '',
    dateImmatriculation: '',
    dateDebutActiv: '',
    dateRadiation: '',
    dateCessationActivite: '',
    isPersonneMorale: true,
    dateClotureExercice: '',
    dureePersonneMorale: '',
    capital: '',
  };
};
