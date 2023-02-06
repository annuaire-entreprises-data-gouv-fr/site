export const mock = {
  data: {
    rna: 'W751080001',
    ancien_id: '1234567890',
    siren: '751080001',
    nom: 'LA PRÉVENTION ROUTIERE',
    active: true,
    sigle: 'LPR',
    reconnue_utilite_publique: false,
    siret_siege: '75108000100013',
    forme_juridique: {
      code: '9220',
      libelle: 'Association déclarée',
    },
    regime: 'Loi 1901',
    groupement: 'Simple',
    eligibilite_cec: false,
    raison_non_eligibilite_cec: 'L’association n’a pas trois ans d’existence',
    impots_commerciaux: true,
    date_creation: '2015-01-01',
    date_dissolution: '2016-01-01',
    date_publication_reconnue_utilite_publique: '2017-01-01',
    date_publication_journal_officiel: '2018-01-01',
    adresse_siege: {
      complement: '',
      numero_voie: '33',
      type_voie: 'rue',
      libelle_voie: 'de Modagor',
      distribution: 'string',
      code_insee: '75108',
      code_postal: '75009',
      commune: 'Paris',
    },
    alsace_moselle: {
      tribunal_instance: "Tribunal d'instance de Strasbourg",
      volume: '122',
      folio: '082',
      date_publication_registre_association: '2019-01-01',
    },
    composition_reseau: [
      {
        nom: "Association des parents d'élèves de l'école primaire de la ville",
        rna: 'W123456789',
        siret: '12345678901234',
        telephone: '0123456789',
        courriel: 'reseau@association.fr',
        objet:
          "Promouvoir l'engagement des parents d'élèves dans l'éducation de leurs enfants",
      },
    ],
    agrements: [
      {
        numero: '05.11.2018',
        date_attribution: '2018-11-05',
        type: 'Formation',
        niveau: 'local',
        attributeur: "Ministère de l'Education nationale",
        url: 'https://associations.api.gouv.fr/agrements/05.11.2018.pdf',
      },
    ],
    activites: {
      objet:
        "L'association a pour objet de promouvoir la pratique du sport de haut niveau et de contribuer à la formation des jeunes sportifs.",
      objet_social1: {
        code: '017055',
        libelle: 'accompagnement, aide aux malades',
      },
      objet_social2: {
        code: '009040',
        libelle: 'clubs troisième âge',
      },
      champ_action_territorial: 'departemental',
      activite_principale: {
        code: '88.99B',
        libelle: 'Action sociale sans hébergement n.c.a.',
      },
      tranche_effectif: {
        code: '51',
        intitule: '2 000 à 4 999 salariés',
      },
      economie_sociale_et_solidaire: true,
      date_appartenance_ess: '2019-01-01',
    },
    etablissements: [
      {
        siren: '123456789',
        siret: '12345678900001',
        actif: true,
        siege: true,
        nom: 'Croix rouge française',
        telephone: '0123456789',
        courriel: 'contact@association.fr',
        date_debut_activite: '2019-01-01',
        adresse: {
          complement: '',
          numero_voie: '33',
          type_voie: 'rue',
          libelle_voie: 'de Modagor',
          distribution: 'string',
          code_insee: '75108',
          code_postal: '75009',
          commune: 'Paris',
        },
        activite_principale: {
          code: '88.99B',
          libelle: 'Action sociale sans hébergement n.c.a.',
        },
        tranche_effectif: {
          code: '51',
          intitule: '2 000 à 4 999 salariés',
        },
        rhs: [
          {
            annee: '2019',
            nombre_benevoles: 10,
            nombre_volontaires: 11,
            nombre_salaries: 12,
            nombre_salaries_etpt: 13,
            nombre_emplois_aides: 14,
            nombre_personnels_detaches: 15,
            nombre_adherents: {
              hommes: 16,
              femmes: 17,
              total: 33,
            },
          },
        ],
        comptes: [
          {
            annee: '2019',
            commisaire_aux_comptes: true,
            montant_dons: 1000,
            cause_subventions: "Subventions d'investissement",
            montant_subventions: 1200,
            montant_aides_sur_3ans: 1230,
            total_charges: 1234,
            total_resultat: 2000,
            total_produits: 3000,
          },
        ],
        representant_legaux: [
          {
            civilite: 'Monsieur',
            nom: 'DUPONT',
            prenom: 'JEAN',
            fonction: 'Président',
            valideur_cec: true,
            publication_internet: true,
            telephone: '0623456789',
            courriel: 'dupont.jean@association.fr',
          },
        ],
        documents_dac: [
          {
            nom: 'Rapport annuel 2019.pdf',
            annee_validite: '2019',
            commentaire:
              'Les comptes annuels sont consolidés au niveau national',
            etat: 'courant',
            type: 'Budget prévisionnel',
            date_depot: '2019-01-01',
            url: 'https://associations.api.gouv.fr/documents/rapport_annuel.pdf',
          },
        ],
      },
    ],
    reseaux_affiliation: [
      {
        nom: "Réseau des associations de parents d'élèves",
        numero: 'IDF0234567',
        rna: 'W123456789',
        siret: '12345678901234',
        objet:
          "Promouvoir l'engagement des parents d'élèves dans l'éducation de leurs enfants",
        adresse: {
          complement: '',
          numero_voie: '33',
          type_voie: 'rue',
          libelle_voie: 'de Modagor',
          distribution: 'string',
          code_insee: '75108',
          code_postal: '75009',
          commune: 'Paris',
        },
        telephone: '0123456789',
        courriel: 'reseau@association.fr',
        attestation_affiliation_url:
          'https://associations.api.gouv.fr/documents/attestation_affiliation.pdf',
        nombre_licencies: {
          hommes: 16,
          femmes: 17,
          total: 33,
        },
      },
    ],
    documents_rna: [
      {
        type: 'Pièce',
        sous_type: {
          code: 'STC',
          libelle: 'Statuts',
        },
        date_depot: '2019-01-01',
        annee_depot: '2019',
        url: 'https://associations.api.gouv.fr/documents/rapport_annuel.pdf',
      },
    ],
  },
  meta: {
    internal_id: '1234567890',
    date_derniere_mise_a_jour_sirene: '2019-01-01',
    date_derniere_mise_a_jour_rna: '2019-01-01',
  },
};
