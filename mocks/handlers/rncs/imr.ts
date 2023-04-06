import { mockMapping } from 'mocks/utils';

export const imr = {
  siren: mockMapping.rge,
  dirigeants: [
    {
      prenom: 'Ilan',
      nom: 'Levy',
      role: 'Directeur général',
      dateNaissancePartial: '1981-10',
      dateNaissanceFull: '1981-10-15',
    },
    {
      siren: '878719756',
      denomination: 'GSE VD',
      role: 'Président',
      natureJuridique: 'Société par actions simplifiée',
    },
  ],
  beneficiaires: [
    {
      type: 'Société',
      nom: 'Sitbon',
      prenoms: 'Philippe',
      dateNaissancePartial: '1964-10',
      nationalite: 'FRANCAISE',
    },
    {
      type: 'Société',
      nom: 'Sabban',
      prenoms: 'Gilles',
      dateNaissancePartial: '1965-09',
      nationalite: 'FRANCAISE',
    },
  ],
  identite: {
    dateImmatriculation: '2010-11-05',
    dateDebutActiv: '',
    dateRadiation: '',
    dateCessationActivite: '',
    denomination: 'GROUPE SOLUTION ENERGIE POLE TECHNIQUE(G.S.E.P.T.)',
    dureePersonneMorale: '99 ans',
    dateClotureExercice: '30 Septembre',
    capital: '26 000 Euros (fixe)',
    isPersonneMorale: true,
    libelleNatureJuridique: 'Société par actions simplifiée',
    natureEntreprise: '',
  },
  observations: [],
  metadata: {
    isFallback: false,
  },
};
