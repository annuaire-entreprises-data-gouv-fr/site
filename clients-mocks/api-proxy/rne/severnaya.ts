/**
 * This uniteLegale has the characteristics
 * (PROTECTED)
 */
export default {
  match: 'https://rncs-proxy.api.gouv.fr/rne/908595879',
  response: {
    siren: '908595879',
    dirigeants: [
      {
        prenom: 'Pierre',
        nom: 'Estournet',
        role: 'Président',
        dateNaissancePartial: '1985-12',
      },
    ],
    beneficiaires: [
      {
        type: 'Société',
        nom: 'Estournet',
        prenoms: 'Pierre',
        dateNaissancePartial: '1985-12',
        nationalite: 'Française',
      },
    ],
    identite: {
      dateImmatriculation: '2021-12-27',
      dateDebutActiv: '2021-12-27',
      dateRadiation: '',
      dateCessationActivite: '',
      denomination: 'Severnaya',
      dureePersonneMorale: '99 ans',
      dateClotureExercice: '31 décembre',
      capital: '1 000 EUR (fixe)',
      isPersonneMorale: true,
      libelleNatureJuridique: 'Société par actions simplifiée',
      natureEntreprise: '',
    },
    observations: [],
    metadata: {
      isFallback: false,
    },
  },
};
