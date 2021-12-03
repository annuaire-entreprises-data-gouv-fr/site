//==============
// Representants
//==============

import { IDirigeant } from '../../../models/dirigeants';
import {
  formatFirstNames,
  formatNameFull,
} from '../../../utils/helpers/formatting';
import { logWarningInSentry } from '../../../utils/sentry';
import { IRNCSRepresentantResponse, IRNCSResponseDossier } from '../IMR';

export const extractRepresentants = (dossier: IRNCSResponseDossier) => {
  const representantsObject = dossier?.representants?.representant;

  if (!representantsObject) {
    const representantEI = extractDirigeantFromIdentite(dossier);
    if (!representantEI) {
      logWarningInSentry('No Dirigeant found', { siren: dossier['@_siren'] });
      return [];
    }
    return [representantEI];
  }

  const representants = Array.isArray(representantsObject)
    ? representantsObject
    : [representantsObject];

  return representants.map(mapToDomainDirigeant);
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
  dossierPrincipal: IRNCSResponseDossier
) => {
  if (!dossierPrincipal.identite || !dossierPrincipal.identite.identite_PP) {
    return null;
  }
  return mapToDomainFromIdentite(dossierPrincipal);
};

const mapToDomainFromIdentite = (
  dossierPrincipal: IRNCSResponseDossier
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
  } = dossierPrincipal.identite;

  return {
    sexe: null,
    prenom: formatFirstNames((prenom || '').split(' '), 0),
    nom: formatNameFull(nom_patronymique, nom_usage),
    role: 'Représentant Légal',
    lieuNaissance: (lieu_naiss || '') + ', ' + (pays_naiss || ''),
    dateNaissance: (dat_naiss || '').toString().slice(0, 4),
  };
};
