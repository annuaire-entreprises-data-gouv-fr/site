//==============
// Representants
//==============

import { IDirigeant } from '../../../models/dirigeants';
import {
  capitalize,
  formatFirstNames,
  formatNameFull,
} from '../../../utils/helpers/formatting';
import { logWarningInSentry } from '../../../utils/sentry';
import {
  IRNCSIdentiteResponse,
  IRNCSRepresentantResponse,
  IRNCSResponseDossier,
} from '../IMR';
import { selectRelevantRecord } from '../IMRParser';

export const extractRepresentants = (dossiers: IRNCSResponseDossier[]) => {
  const representants = dossiers.reduce(
    (aggregate: IRNCSRepresentantResponse[][], dossier) => {
      const representant = dossier?.representants?.representant;
      if (representant) {
        const representantArray = Array.isArray(representant)
          ? representant
          : [representant];

        aggregate.push(representantArray);
      }

      return aggregate;
    },
    []
  );

  return selectRelevantRecord(representants).map(mapToDomainDirigeant);
};

const mapToDomainDirigeant = (
  dirigeant: IRNCSRepresentantResponse
): IDirigeant => {
  const {
    prenoms,
    nom_patronymique,
    nom_usage,
    lieu_naiss,
    code_pays_naiss,
    dat_naiss,
    qualites,
    form_jur,
    siren,
    denomination,
    type,
  } = dirigeant;

  const qualite = (qualites || {}).qualite;
  const roles = Array.isArray(qualite) ? qualite.join(', ') : qualite;

  if (type === 'P.Physique') {
    return {
      sexe: null,
      prenom: formatFirstNames((prenoms || '').split(' '), 0),
      nom: formatNameFull(nom_patronymique, nom_usage),
      role: roles || '',
      lieuNaissance: (lieu_naiss || '') + ', ' + (code_pays_naiss || ''),
      dateNaissance: (dat_naiss || '').toString().slice(0, 4),
    };
  } else {
    const sirenAsString = (siren || '').toString();
    return {
      siren: sirenAsString,
      denomination: denomination || '',
      role: roles || '',
      natureJuridique: form_jur || '',
    };
  }
};

export const extractDirigeantFromIdentite = (
  dossiers: IRNCSResponseDossier[],
  siren: string
) => {
  if (dossiers.filter((d) => d.identite).length > 1) {
    logWarningInSentry('Found several identite in IMR', { siren });
  }
  const dossier = dossiers[0];
  return mapToDomainFromIdentite(dossier.identite);
};

const mapToDomainFromIdentite = (
  identite: IRNCSIdentiteResponse
): IDirigeant => {
  const {
    identite_PP: {
      nom_patronymique,
      nom_usage,
      prenom,
      dat_naiss,
      lieu_naiss,
      pays_naiss,
    },
  } = identite;

  return {
    sexe: null,
    prenom: formatFirstNames((prenom || '').split(' '), 0),
    nom: formatNameFull(nom_patronymique, nom_usage),
    role: '',
    lieuNaissance: (lieu_naiss || '') + ', ' + (pays_naiss || ''),
    dateNaissance: (dat_naiss || '').toString().slice(0, 4),
  };
};
