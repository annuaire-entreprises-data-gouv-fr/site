const routes = {
  ban: 'https://api-adresse.data.gouv.fr/search/?q=',
  bodacc: {
    ods: {
      metadata:
        'https://bodacc-datadila.opendatasoft.com/api/datasets/1.0/search/?q=annonces-commerciales',
      search:
        'https://bodacc-datadila.opendatasoft.com/api/records/1.0/search/?dataset=annonces-commerciales',
    },
    site: {
      annonce: 'https://www.bodacc.fr/annonce/detail-annonce/',
      recherche:
        'https://www.bodacc.fr/pages/annonces-commerciales/?sort=dateparution',
    },
  },
  conventionCollectives: {
    api: 'https://siret2idcc.fabrique.social.gouv.fr/api/v2/',
    site: 'https://code.travail.gouv.fr/outils/convention-collective',
  },
  educationNationale: {
    api: 'https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-annuaire-education',
    site: 'https://www.education.gouv.fr/annuaire',
  },
  geo: {
    commune:
      'https://geo.api.gouv.fr/communes?fields=codesPostaux&format=json&nom=',
    departement:
      'https://geo.api.gouv.fr/departements?fields=code&format=json&nom=',
  },
  journalOfficielAssociations: {
    ods: {
      metadata:
        'https://journal-officiel-datadila.opendatasoft.com/api/datasets/1.0/search/?q=jo_associations',
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
  matomo: {
    report: {
      copyPasteEvents:
        'https://stats.data.gouv.fr/index.php?module=API&format=json&idSite=145&period=range&method=Events.getNameFromCategoryId&idSubtable=7&module=API&showColumns=label,nb_events&filter_limit=9999&date=',
      npsEvents:
        'https://stats.data.gouv.fr/index.php?module=API&format=json&idSite=145&period=range&method=Events.getNameFromCategoryId&idSubtable=4&module=API&showColumns=label,nb_events&filter_limit=9999&date=',
      visits:
        'https://stats.data.gouv.fr/index.php?module=API&method=API.getBulkRequest&format=json',
    },
    tracker: 'https://stats.data.gouv.fr/piwik.php',
  },
  monitoring: 'https://api.uptimerobot.com/v2/getMonitors',
  certifications: {
    rge: {
      api: 'https://data.ademe.fr/data-fair/api/v1/datasets/liste-des-entreprises-rge-2/lines/',
      site: 'https://france-renov.gouv.fr/annuaire-rge',
    },
    entrepreneurSpectacles: {
      ods: {
        metadata:
          'https://data.culture.gouv.fr/api/datasets/1.0/search/?q=declarations-des-entrepreneurs-de-spectacles-vivants',
        search:
          'https://data.culture.gouv.fr/api/records/1.0/search/?dataset=declarations-des-entrepreneurs-de-spectacles-vivants',
      },
    },
  },
  rna: {
    id: 'https://entreprise.data.gouv.fr/api/rna/v1/id/',
    siren: 'https://entreprise.data.gouv.fr/api/rna/v1/siret/',
  },
  rncs: {
    portail: {
      account: 'https://data.inpi.fr/register',
      entreprise: 'https://data.inpi.fr/entreprises/',
      pdf: 'https://data.inpi.fr/export/companies',
    },
    proxy: {
      document: {
        justificatif: {
          createJob:
            'https://rncs-proxy.api.gouv.fr/document/justificatif/job/',
          directDownload:
            'https://rncs-proxy.api.gouv.fr/document/justificatif/',
          get: 'https://rncs-proxy.api.gouv.fr/downloads/',
          status:
            'https://rncs-proxy.api.gouv.fr/document/justificatif/job/status',
        },
      },
      imr: 'https://rncs-proxy.api.gouv.fr/imr/',
    },
  },
  rnm: 'https://api-rnm.artisanat.fr/v2/entreprises/',
  sireneInsee: {
    auth: 'https://api.insee.fr/token',
    avis: 'https://avis-situation-sirene.insee.fr/AvisPdf.action',
    siege:
      'https://api.insee.fr/entreprises/sirene/V3/siret?q=etablissementSiege:true%20AND%20siren:',
    siren: 'https://api.insee.fr/entreprises/sirene/V3/siren/',
    siret: 'https://api.insee.fr/entreprises/sirene/V3/siret/',
    siretBySiren: 'https://api.insee.fr/entreprises/sirene/V3/siret?q=siren:',
  },
  sireneOuverte: {
    etablissement: 'https://api-annuaire-entreprises.data.gouv.fr/siret?q=',
    rechercheUniteLegale: 'https://recherche-entreprises.api.gouv.fr/search',
    rechercheUniteLegaleStaging:
      'https://staging.recherche-entreprises.api.gouv.fr/search',
    uniteLegale: 'https://api-annuaire-entreprises.data.gouv.fr/siren?q=',
  },
  tva: {
    vies: 'https://ec.europa.eu/taxation_customs/vies/rest-api/ms/FR/vat/',
  },
};

export default routes;
