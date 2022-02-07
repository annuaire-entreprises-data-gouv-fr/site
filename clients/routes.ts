const routes = {
  monitoring: 'https://api.uptimerobot.com/v2/getMonitors',
  ban: 'https://api-adresse.data.gouv.fr/search/?q=',
  rnm: `https://api-rnm.artisanat.fr/v2/entreprises/`,
  rna: {
    id: `https://entreprise.data.gouv.fr/api/rna/v1/id/`,
    siren: `https://entreprise.data.gouv.fr/api/rna/v1/siret/`,
  },
  rncs: {
    portail: {
      entreprise: 'https://data.inpi.fr/entreprises/',
      login: 'https://data.inpi.fr/login',
    },
    api: {
      login: 'https://opendata-rncs.inpi.fr/services/diffusion/login',
      imr: {
        find: 'https://opendata-rncs.inpi.fr/services/diffusion/imrs-saisis/find?siren=',
        get: 'https://opendata-rncs.inpi.fr/services/diffusion/imrs-saisis/get?listeSirens=',
      },
    },
  },
  bodacc: {
    ods: {
      search:
        'https://bodacc-datadila.opendatasoft.com/api/records/1.0/search/?dataset=annonces-commerciales',
      metadata:
        'https://bodacc-datadila.opendatasoft.com/api/datasets/1.0/search/?q=annonces-commerciales',
    },
    site: {
      recherche: 'https://www.bodacc.fr/annonce/liste/',
      annonce: 'https://www.bodacc.fr/annonce/detail-annonce/',
    },
  },
  journalOfficielAssociations: {
    ods: {
      search:
        'https://journal-officiel-datadila.opendatasoft.com/api/records/1.0/search/?dataset=jo_associations',
      metadata:
        'https://journal-officiel-datadila.opendatasoft.com/api/datasets/1.0/search/?q=jo_associations',
    },
    site: {
      recherche: 'https://www.journal-officiel.gouv.fr/associations/recherche/',
      justificatif:
        'https://www.journal-officiel.gouv.fr/document/associations_b/',
    },
  },
  sireneInsee: {
    siren: 'https://api.insee.fr/entreprises/sirene/V3/siren/',
    siret: 'https://api.insee.fr/entreprises/sirene/V3/siret/',
    siege:
      'https://api.insee.fr/entreprises/sirene/V3/siret?q=etablissementSiege:true%20AND%20siren:',
    siretBySiren: 'https://api.insee.fr/entreprises/sirene/V3/siret?q=siren:',
    auth: 'https://api.insee.fr/token',
    avis: 'https://avis-situation-sirene.insee.fr/AvisPdf.action',
  },
  sireneOuverte: {
    etablissement: `https://api-annuaire-entreprises.data.gouv.fr/siret?q=`,
    uniteLegale: `https://api-annuaire-entreprises.data.gouv.fr/siren?q=`,
    rechercheUniteLegale: `http://annuaire-entreprises.dataeng.etalab.studio/search`,
  },
  conventionCollectives: {
    api: 'https://siret2idcc.fabrique.social.gouv.fr/api/v2/',
    site: 'https://code.travail.gouv.fr/outils/convention-collective',
  },
  franceConnect: {
    authorization: '/api/v1/authorize',
    token: '/api/v1/token',
    userInfo: '/api/v1/userinfo',
    logout: '/api/v1/logout',
  },
  matomo: {
    report: {
      visits:
        'https://stats.data.gouv.fr/index.php?module=API&method=API.getBulkRequest&format=json',
      npsEvents:
        'https://stats.data.gouv.fr/index.php?module=API&format=json&idSite=145&period=range&method=Events.getNameFromCategoryId&idSubtable=4&module=API&showColumns=label,nb_events&filter_limit=9999&date=',
    },
    tracker: 'https://stats.data.gouv.fr/piwik.php',
  },
};

export default routes;
