//==============
// Identite / Immatriculation
//==============

import { IIdentite } from '../../../models/dirigeants';
import { formatFloatFr, formatIntFr } from '../../../utils/helpers/formatting';
import { libelleFromCodeGreffe } from '../../../utils/labels';
import { IRNCSIdentiteResponse, IRNCSResponseDossier } from '../IMR';
import { formatINPIDateField } from '../helper';

export const extractIdentite = (dossierPrincipal: IRNCSResponseDossier) => {
  return mapToDomainIdentite(dossierPrincipal.identite, dossierPrincipal);
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
    identite_PP,
    dat_rad,
    dat_cessat_activite,
  } = identite;

  const isPP = !identite_PM;

  const codeGreffe = dossier['@_code_greffe'];
  const greffe = libelleFromCodeGreffe(codeGreffe);
  const dateImmatriculation = dat_1ere_immat
    ? formatINPIDateField(dat_1ere_immat)
    : dat_immat
    ? formatINPIDateField(dat_immat)
    : '';

  const infosIdentite = {
    greffe,
    codeGreffe, //'7501',
    numeroRCS: `RCS ${greffe} ${formatIntFr(dossier['@_siren'])}`,
    numGestion: dossier['@_num_gestion'], // '2020B02214',
    dateImmatriculation,
    dateDebutActiv: formatINPIDateField(date_debut_activ),
    dateGreffe: formatINPIDateField(date_greffe),
    dateRadiation: formatINPIDateField(dat_rad),
    dateCessationActivite: formatINPIDateField(dat_cessat_activite),
  };
  if (isPP) {
    const { prenom, nom_patronymique } = identite_PP;

    const denominationPP =
      prenom || nom_patronymique ? `${prenom} ${nom_patronymique}` : '';

    return {
      ...infosIdentite,
      denomination: denominationPP,
      isPersonneMorale: false,
      dureePersonneMorale: '',
      dateClotureExercice: '',
      capital: '',
    };
  } else {
    const {
      denomination,
      sigle,
      type_cap,
      montant_cap,
      devise_cap,
      duree_pm,
      dat_cloture_exer,
    } = identite_PM;

    const capital =
      isPP || !montant_cap
        ? ''
        : `${formatFloatFr(montant_cap)} ${devise_cap} (${
            type_cap === 'F' ? 'fixe' : 'variable'
          })`;

    const denominationPM = denomination + (sigle ? `(${sigle})` : '');
    return {
      ...infosIdentite,
      denomination: denominationPM,
      dureePersonneMorale: duree_pm ? `${duree_pm} ans` : '',
      dateClotureExercice: dat_cloture_exer || '',
      capital,
      isPersonneMorale: true,
    };
  }
};
