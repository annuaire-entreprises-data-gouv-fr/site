/**
 * This uniteLegale has the characteristics
 * (Collectivité territoriale)
 */
export default {
  match: [
    'https://recherche-entreprises.api.gouv.fr/search?per_page=10&page=1&q=200054781',
  ],
  response: {
    results: [
      {
        siren: '200054781',
        nom_complet: 'METROPOLE DU GRAND PARIS (MGP)',
        nom_raison_sociale: 'METROPOLE DU GRAND PARIS',
        sigle: 'MGP',
        nombre_etablissements: 2,
        nombre_etablissements_ouverts: 1,
        siege: {
          activite_principale: '84.11Z',
          activite_principale_registre_metier: null,
          adresse: 'BATIMENT BE OPEN 15 AV PIERRE MENDES FRANCE 75013 PARIS 13',
          cedex: null,
          code_pays_etranger: null,
          code_postal: '75013',
          commune: '75113',
          complement_adresse: 'BATIMENT BE OPEN',
          coordonnees: '48.837285,2.370436',
          date_creation: '2016-12-28',
          date_debut_activite: '2016-12-28',
          departement: '75',
          distribution_speciale: null,
          est_siege: true,
          etat_administratif: 'A',
          geo_adresse: '15 Avenue Pierre Mendès France 75013 Paris',
          geo_id: '75113_7460_00015',
          indice_repetition: null,
          latitude: '48.837285',
          libelle_cedex: null,
          libelle_commune: 'PARIS 13',
          libelle_commune_etranger: null,
          libelle_pays_etranger: null,
          libelle_voie: 'PIERRE MENDES FRANCE',
          liste_enseignes: null,
          liste_finess: null,
          liste_id_bio: null,
          liste_idcc: ['5021'],
          liste_id_organisme_formation: null,
          liste_rge: null,
          liste_uai: null,
          longitude: '2.370436',
          nom_commercial: null,
          numero_voie: '15',
          siret: '20005478100022',
          tranche_effectif_salarie: '22',
          type_voie: 'AV',
        },
        activite_principale: '84.11Z',
        categorie_entreprise: 'PME',
        date_creation: '2016-01-01',
        date_mise_a_jour: '2022-08-29T09:05:12',
        dirigeants: [],
        etat_administratif: 'A',
        nature_juridique: '7344',
        section_activite_principale: 'O',
        tranche_effectif_salarie: '22',
        matching_etablissements: [],
        complements: {
          collectivite_territoriale: {
            code: '200054781',
            code_insee: null,
            elus: [
              {
                nom: 'HIDALGO',
                prenoms: 'Anne',
                annee_de_naissance: '1959',
                fonction: 'Vice-président du conseil communautaire',
                sexe: 'F',
              },
              {
                nom: 'BÉNÉDIC',
                prenoms: 'Fabien',
                annee_de_naissance: '1973',
                fonction: null,
                sexe: 'M',
              },
              {
                nom: 'MOTHRON',
                prenoms: 'Georges',
                annee_de_naissance: '1948',
                fonction: null,
                sexe: 'M',
              },
              {
                nom: 'VALIER',
                prenoms: 'France-Lise',
                annee_de_naissance: '1968',
                fonction: null,
                sexe: 'F',
              },
            ],
            niveau: 'epci',
          },
          convention_collective_renseignee: true,
          egapro_renseignee: false,
          est_bio: false,
          est_entrepreneur_individuel: false,
          est_entrepreneur_spectacle: false,
          est_ess: false,
          est_finess: false,
          est_organisme_formation: false,
          est_rge: false,
          est_service_public: true,
          est_uai: false,
          identifiant_association: null,
          statut_entrepreneur_spectacle: null,
        },
        etablissements: [
          {
            activite_principale: '84.11Z',
            adresse:
              'BATIMENT BE OPEN 15 AV PIERRE MENDES FRANCE 75013 PARIS 13',
            commune: '75113',
            est_siege: true,
            etat_administratif: 'A',
            geo_id: '75113_7460_00015',
            latitude: '48.837285',
            libelle_commune: 'PARIS 13',
            liste_enseignes: null,
            liste_finess: null,
            liste_id_bio: null,
            liste_idcc: ['5021'],
            liste_id_organisme_formation: null,
            liste_rge: null,
            liste_uai: null,
            longitude: '2.370436',
            nom_commercial: null,
            siret: '20005478100022',
          },
          {
            activite_principale: '84.11Z',
            adresse: '19 RUE LEBLANC 75015 PARIS 15',
            commune: '75115',
            est_siege: false,
            etat_administratif: 'F',
            geo_id: '75115_5422_00019',
            latitude: '48.839849',
            libelle_commune: 'PARIS 15',
            liste_enseignes: null,
            liste_finess: null,
            liste_id_bio: null,
            liste_idcc: null,
            liste_id_organisme_formation: null,
            liste_rge: null,
            liste_uai: null,
            longitude: '2.273505',
            nom_commercial: null,
            siret: '20005478100014',
          },
        ],
        slug_annuaire_entreprises: 'metropole-du-grand-paris-mgp-200054781',
      },
    ],
    total_results: 1,
    page: 1,
    per_page: 10,
    total_pages: 1,
  },
};