const certificatsLogo = {
  qualibat: 'qualibat.jpg',
  qualifelec: 'qualifelec.jpg',
  qualipac: 'qualiPAC.jpg',
  qualibois: 'qualiBois.jpg',
  opqibi: 'opqibi.jpg',
  'chauffage +': 'chauffage.jpg',
  qualipv: 'qualiPV.jpg',
  ventilation: 'ventillation.jpg',
  qualisol: 'qualisol.jpg',
  certibat: 'certibat.jpg',
  habitat: 'NF.jpg',
  qualiforage: 'aualiForage.jpg',
};

/**
 * match logo path on partial certificats names as several certificates share the same logo
 *
 * eg : "Qualibois module Air" and "Qualibois module Eau" => QualiBois.jpg
 *  */

export const getCertificatLogoPath = (nomCertificat: string) => {
  for (let [certificateSub, path] of Object.entries(certificatsLogo)) {
    if ((nomCertificat || '').toLowerCase().indexOf(certificateSub) !== -1) {
      return `/images/rge/logo-rge-${path}` || '';
    }
  }
  return '';
};
