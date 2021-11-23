//==============
// Beneficiaires
//==============

import { IBeneficiaire } from '../../../models/dirigeants';
import {
  formatFirstNames,
  formatName,
} from '../../../utils/helpers/formatting';
import { libelleFromCodeBeneficiaires } from '../../../utils/labels';
import { formatINPIDateField } from '../helper';
import { IRNCSBeneficiaireResponse, IRNCSResponseDossier } from '../IMR';

export const extractBeneficiaires = (dossier: IRNCSResponseDossier) => {
  const beneficiairesObject = dossier?.beneficiaires?.beneficiaire;

  if (!beneficiairesObject) {
    // no beneficiaires found or declared
    return [];
  }

  const beneficiaires = Array.isArray(beneficiairesObject)
    ? beneficiairesObject
    : [beneficiairesObject];

  return beneficiaires.map(mapToDomainBeneficiaires);
};

const mapToDomainBeneficiaires = (
  beneficiaire: IRNCSBeneficiaireResponse
): IBeneficiaire => {
  const {
    date_greffe,
    type_entite,
    nom_naissance,
    prenoms,
    date_naissance,
    nationalite,
  } = beneficiaire;

  return {
    type: libelleFromCodeBeneficiaires(type_entite),
    nom: formatName(nom_naissance, ''),
    prenoms: formatFirstNames((prenoms || '').split(' ')),
    dateNaissance: (date_naissance || '').toString(),
    dateGreffe: formatINPIDateField(date_greffe),
    nationalite: nationalite || '',
  };
};
