//==============
// Representants
//==============

import { IDirigeant } from '../../../models/dirigeants';
import { IRNCSRepresentantResponse, IRNCSResponseDossier } from '../IMR';
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
      prenom: (prenoms || '').split(' ')[0],
      nom: nom_patronymique || '',
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
