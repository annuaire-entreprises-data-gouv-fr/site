//==============
// Beneficiaires
//==============

import { IBeneficiaire } from '../../../models/dirigeants';
import {
  formatFirstNames,
  formatName,
} from '../../../utils/helpers/formatting';
import { IRNCSBeneficiaireResponse, IRNCSResponseDossier } from '../IMR';
import { selectRelevantRecord } from '../IMRParser';

export const extractBeneficiaires = (dossiers: IRNCSResponseDossier[]) => {
  const beneficiaires = dossiers.reduce(
    (aggregate: IRNCSBeneficiaireResponse[][], dossier) => {
      const beneficiaire = dossier?.beneficiaires?.beneficiaire;
      if (beneficiaire) {
        const benef = Array.isArray(beneficiaire)
          ? beneficiaire
          : [beneficiaire];

        aggregate.push(benef);
      }

      return aggregate;
    },
    []
  );
  return selectRelevantRecord(beneficiaires).map(mapToDomainBeneficiaires);
};

const mapToDomainBeneficiaires = (
  beneficiaire: IRNCSBeneficiaireResponse
): IBeneficiaire => {
  const { nom_naissance, prenoms, date_naissance, nationalite } = beneficiaire;
  return {
    nom: formatName(nom_naissance, ''),
    prenoms: formatFirstNames((prenoms || '').split(' ')),
    dateNaissance: (date_naissance || '').toString(),
    nationalite: nationalite || '',
  };
};
