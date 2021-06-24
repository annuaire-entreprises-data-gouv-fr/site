import parser from 'fast-xml-parser';

import { IRNCSResponse } from './IMR';

export const extractIMRFromXml = (responseAsXml: string) => {
  const response = parseXmlToJson(responseAsXml);

  let dossier;
  if (Array.isArray(response.fichier.dossier)) {
    dossier = response.fichier.dossier.find(
      (element) => element.representants !== undefined
    );
  } else {
    dossier = response.fichier.dossier;
  }
  const representant = dossier.representants.representant;
  const isRepresentantAnArray = Array.isArray(representant);

  let dirigeants;
  if (isRepresentantAnArray) {
    dirigeants = representant;
  } else {
    dirigeants = [representant];
  }

  return dirigeants.map(extractDirigeant);
};

const parseXmlToJson = (xmlString: string): IRNCSResponse => {
  const tObj = parser.getTraversalObj(xmlString, { arrayMode: false });
  return parser.convertToJson(tObj, { arrayMode: false });
};

const extractDirigeant = (dirigeant: any) => {
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
  try {
    const qualite = qualites.qualite;
    const roles = Array.isArray(qualite) ? qualite.join(', ') : qualite;
    if (type === 'P.Physique') {
      return {
        prenom: (prenoms || '').split(' ')[0],
        nom: nom_patronymique,
        role: roles,
        lieuNaissance: lieu_naiss + ', ' + code_pays_naiss,
        dateNaissance: (dat_naiss || '').toString().slice(0, 4),
      };
    } else {
      const sirenAsString = (siren || '').toString();
      return {
        siren: sirenAsString,
        denomination: denomination,
        role: roles,
        natureJuridique: form_jur,
      };
    }
  } catch (e) {
    console.log(dirigeant);
    console.log(e);
  }
};
