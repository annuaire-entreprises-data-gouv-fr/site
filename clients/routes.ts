const routes = {
  api: {
    rne: {
      immatriculation: '/api/data-fetching/rne',
      documents: {
        list: `/api/data-fetching/espace-agent/documents/`,
        download: `/api/data-fetching/espace-agent/documents/download/`,
      },
    },
    conformite: `/api/data-fetching/espace-agent/conformite`,
  },
  apiEntreprise: {
    association: '/v4/djepva/api-association/associations/',
    conformite: {
      fiscale: '/v4/dgfip/unites_legales/',
      vigilance: '/v4/urssaf/unites_legales/',
      msa: '/v3/msa/etablissements/',
    },
  },
  ban: 'https://api-adresse.data.gouv.fr/search/?q=',
  bodacc: {
    ods: {
      metadata:
        'https://bodacc-datadila.opendatasoft.com/api/datasets/1.0/annonces-commerciales',
      search:
        'https://bodacc-datadila.opendatasoft.com/api/records/1.0/search/?dataset=annonces-commerciales',
    },
    site: {
      annonce: 'https://www.bodacc.fr/annonce/detail-annonce/',
      recherche:
        'https://www.bodacc.fr/pages/annonces-commerciales/?sort=dateparution',
    },
  },
  conventionsCollectives: {
    metadata:
      'https://recherche-entreprises.api.gouv.fr/metadata/conventions_collectives',
    site: 'https://code.travail.gouv.fr/outils/convention-collective',
    details: 'https://code.travail.gouv.fr/convention-collective/',
  },
  donneesFinancieres: {
    ods: {
      metadata:
        'https://data.economie.gouv.fr/api/datasets/1.0/ratios_inpi_bce/',
      search:
        'https://data.economie.gouv.fr/api/records/1.0/search/?dataset=ratios_inpi_bce',
    },
  },
  dgefp: {
    metadata:
      'https://dgefp.opendatasoft.com/api/datasets/1.0/liste-publique-des-of-v2',
    search:
      'https://dgefp.opendatasoft.com/api/records/1.0/search/?dataset=liste-publique-des-of-v2',
  },
  educationNationale: {
    metadata:
      'https://data.education.gouv.fr/api/datasets/1.0/fr-en-annuaire-education',
    search:
      'https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-annuaire-education',
    site: 'https://www.education.gouv.fr/annuaire',
  },
  geo: {
    commune: 'https://geo.api.gouv.fr/communes?fields=codesPostaux&format=json',
    departement:
      'https://geo.api.gouv.fr/departements?fields=code&format=json&zone=metro,drom,com',
    region: 'https://geo.api.gouv.fr/regions?limit=3',
  },
  journalOfficielAssociations: {
    ods: {
      metadata:
        'https://journal-officiel-datadila.opendatasoft.com/api/datasets/1.0/jo_associations',
      search:
        'https://journal-officiel-datadila.opendatasoft.com/api/records/1.0/search/?dataset=jo_associations',
    },
    site: {
      dca: 'https://www.journal-officiel.gouv.fr/pages/associations-detail-annonce',
      justificatif:
        'https://www.journal-officiel.gouv.fr/document/associations_b/',
      recherche:
        'https://www.journal-officiel.gouv.fr/pages/associations-recherche',
    },
  },
  franceConnect: {
    authorization: '/api/v1/authorize',
    token: '/api/v1/token',
    userInfo: '/api/v1/userinfo',
    logout: '/api/v1/logout',
  },
  egapro: {
    index: 'https://egapro.travail.gouv.fr/api/search',
    representation:
      'https://egapro.travail.gouv.fr/api/representation-equilibree/search',
    site: 'https://egapro.travail.gouv.fr',
  },
  certifications: {
    rge: {
      api: 'https://data.ademe.fr/data-fair/api/v1/datasets/liste-des-entreprises-rge-2/lines/',
      site: 'https://france-renov.gouv.fr/annuaire-rge',
    },
    bio: {
      site: 'https://annuaire.agencebio.org/',
      entreprise: 'https://annuaire.agencebio.org/fiche/',
      api: 'https://opendata.agencebio.org/api/gouv/operateurs/',
    },
    entrepreneurSpectacles: {
      ods: {
        metadata:
          'https://data.culture.gouv.fr/api/datasets/1.0/declarations-des-entrepreneurs-de-spectacles-vivants',
        search:
          'https://data.culture.gouv.fr/api/records/1.0/search/?dataset=declarations-des-entrepreneurs-de-spectacles-vivants',
      },
    },
  },
  proxy: {
    rne: {
      immatriculation:
        'https://annuaire-entreprises-api-proxy.api.gouv.fr/rne/',
      documents: {
        list: 'https://annuaire-entreprises-api-proxy.api.gouv.fr/rne/documents/',
        download: {
          acte: 'https://annuaire-entreprises-api-proxy.api.gouv.fr/rne/download/acte/',
          bilan:
            'https://annuaire-entreprises-api-proxy.api.gouv.fr/rne/download/bilan/',
        },
      },
    },
    association:
      'https://annuaire-entreprises-api-proxy.api.gouv.fr/association/',
    tva: 'https://annuaire-entreprises-api-proxy.api.gouv.fr/tva/',
  },
  rne: {
    portail: {
      pdf: 'https://data.inpi.fr/export/companies',
      entreprise: 'https://data.inpi.fr/entreprises/',
      account: 'https://data.inpi.fr/register',
    },
  },
  sireneInsee: {
    auth: 'https://api.insee.fr/token',
    avis: 'https://api-avis-situation-sirene.insee.fr/identification/pdf/',
    siren: 'https://api.insee.fr/entreprises/sirene/V3/siren/',
    siret: 'https://api.insee.fr/entreprises/sirene/V3/siret/',
  },
  rechercheEntreprise: {
    etablissement: 'https://api-annuaire-entreprises.data.gouv.fr/siret?q=',
    rechercheUniteLegale: 'https://recherche-entreprises.api.gouv.fr/search',
    rechercheUniteLegaleStaging:
      'https://recherche-entreprises.api.gouv.fr/search',
    uniteLegale: 'https://api-annuaire-entreprises.data.gouv.fr/siren?q=',
  },
  tooling: {
    grist: 'https://grist.incubateur.net/api/docs/',
    matomo: {
      report: {
        copyPasteEvents:
          'https://stats.data.gouv.fr/index.php?module=API&format=json&idSite=145&period=range&method=Events.getNameFromCategoryId&idSubtable=5&module=API&showColumns=label,nb_events&filter_limit=9999&date=',
        npsEvents:
          'https://stats.data.gouv.fr/index.php?module=API&format=json&idSite=145&period=range&method=Events.getNameFromCategoryId&idSubtable=1&module=API&showColumns=label,nb_events&filter_limit=9999&date=',
        bulkRequest:
          'https://stats.data.gouv.fr/index.php?module=API&method=API.getBulkRequest&format=json',
      },
      tracker: 'https://stats.data.gouv.fr/piwik.php',
    },
    monitoring: 'https://updown.io/api/checks/',
  },
};

export default routes;
