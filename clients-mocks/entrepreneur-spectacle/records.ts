export default {
  regex: 'https://data.culture.gouv.fr/api/records/1.0/search/',
  response: {
    nhits: 1,
    parameters: {
      dataset: 'declarations-des-entrepreneurs-de-spectacles-vivants',
      q: '#startswith(siren_personne_physique_siret_personne_morale,"842019051")',
      rows: 10,
      start: 0,
      sort: ['date_de_depot_de_la_declaration_inscrite_sur_le_recepisse'],
      format: 'json',
      timezone: 'UTC',
    },
    records: [
      {
        datasetid: 'declarations-des-entrepreneurs-de-spectacles-vivants',
        recordid: 'e4c926c3d74a9df0799960c7f07b0fdad0cb5086',
        fields: {
          geoloc_cp: [48.8923628559, 2.34785432498],
          categorie: 2,
          date_de_depot_de_la_declaration_inscrite_sur_le_recepisse:
            '2021-11-30',
          code_postal_de_l_etablissement_principal_personne_morale_ou_de_la_personne_physique:
            '75018',
          raison_sociale_personne_morale_ou_nom_personne_physique:
            'MANAKIN PRODUCTION',
          siren_personne_physique_siret_personne_morale: '84201905100015',
          code_naf_ape: '90.01Z - Arts du spectacle vivant',
          date_de_validite_du_recepisse_sauf_opposition_de_l_administration:
            '12/01/2022',
          type_de_declarant: 'Personne morale',
          type: 'Renouvellement',
          region: 'Île-de-France',
          departement: 'Paris',
          statut_du_recepisse: 'Valide',
          numero_de_recepisse: 'PLATESV-R-2021-013704',
        },
        geometry: {
          type: 'Point',
          coordinates: [2.34785432498, 48.8923628559],
        },
        record_timestamp: '2023-04-06T04:34:31.429Z',
      },
    ],
  },
};
