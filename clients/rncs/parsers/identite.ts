//==============
// Identite / Immatriculation
//==============

import { IIdentite } from '../../../models/dirigeants';
import { formatFloatFr, formatIntFr } from '../../../utils/helpers/formatting';
import { libelleFromCodeGreffe } from '../../../utils/labels';
import logErrorInSentry, { logWarningInSentry } from '../../../utils/sentry';
import { IRNCSIdentiteResponse, IRNCSResponseDossier } from '../IMR';

export const extractIdentite = (
  dossiers: IRNCSResponseDossier[],
  siren: string
) => {
  if (dossiers.filter((d) => d.identite).length > 1) {
    logWarningInSentry('Found several identite in IMR', { siren });
  }

  const dossier = dossiers[0];
  return mapToDomainIdentite(dossier.identite, dossier);
};

/**
 * Format INPI date field (string or number) to relevant format YYYY-MM-DD
 * @param unformatted
 * @returns formatted date
 */
export const formatINPIDateField = (unformatted: string | number): string => {
  try {
    if (!unformatted) {
      return '';
    }
    if (typeof unformatted === 'number') {
      // YYYYMMDD as number
      const YYYYMMDD = unformatted.toString();
      return `${YYYYMMDD.substr(0, 4)}-${YYYYMMDD.substr(
        4,
        2
      )}-${YYYYMMDD.substr(6)}`;
    } else if (unformatted.indexOf('/') === 2) {
      // DD/MM/YYYY
      const times = unformatted.split('/');
      return `${times[2]}-${times[1]}-${times[0]}`;
    } else if (unformatted.indexOf('-') === 4) {
      // YYYY-MM-DD
      return unformatted;
    } else {
      throw new Error('Unknown date format');
    }
  } catch (e) {
    logErrorInSentry('Unknwon date format in INPI’s reponse', {
      details: `${unformatted}`,
    });
    return '';
  }
};

const mapToDomainIdentite = (
  identite: IRNCSIdentiteResponse,
  dossier: IRNCSResponseDossier
): IIdentite => {
  const {
    date_greffe,
    dat_immat,
    date_debut_activ,
    dat_1ere_immat,
    identite_PM,
    dat_rad,
    dat_cessat_activite,
  } = identite;

  const {
    denomination,
    sigle,
    type_cap,
    montant_cap,
    devise_cap,
    duree_pm,
    dat_cloture_exer,
  } = identite_PM;

  const capital = `${formatFloatFr(montant_cap)} ${devise_cap} (${
    type_cap === 'F' ? 'fixe' : 'variable'
  })`;
  const denominationComplete = denomination + (sigle ? `(${sigle})` : '');
  const codeGreffe = dossier['@_code_greffe'];
  const greffe = libelleFromCodeGreffe(codeGreffe);
  const dateImmatriculation = dat_1ere_immat
    ? formatINPIDateField(dat_1ere_immat)
    : dat_immat
    ? formatINPIDateField(dat_immat)
    : '';

  return {
    denomination: denominationComplete,
    greffe,
    codeGreffe, //'7501',
    numeroRCS: `RCS ${greffe} ${formatIntFr(dossier['@_siren'])}`,
    numGestion: dossier['@_num_gestion'], // '2020B02214',
    dateImmatriculation,
    dateDebutActiv: formatINPIDateField(date_debut_activ),
    dureePersonneMorale: duree_pm || '',
    dateClotureExercice: dat_cloture_exer,
    dateGreffe: formatINPIDateField(date_greffe),
    capital,
    dateRadiation: formatINPIDateField(dat_rad),
    dateCessationActivite: formatINPIDateField(dat_cessat_activite),
  };
};
