const routes = {
  espaceAgent: {
    documents: {
      download: '/api/download/espace-agent/documents/',
    },
  },
  apiEntreprise: {
    association: (siren: string) =>
      `/v4/djepva/api-association/associations/${siren}`,
    conformite: {
      fiscale: (siren: string) =>
        `/v4/dgfip/unites_legales/${siren}/attestation_fiscale`,
      vigilance: (siren: string) =>
        `/v4/urssaf/unites_legales/${siren}/attestation_vigilance`,
      msa: (siret: string) =>
        `/v3/msa/etablissements/${siret}/conformite_cotisations`,
    },
    beneficiaires: (siren: string) =>
      `/v3/inpi/rne/unites_legales/${siren}/beneficiaires_effectifs`,
    carteProfessionnelleTravauxPublics: (siren: string) =>
      `/v3/fntp/unites_legales/${siren}/carte_professionnelle_travaux_publics`,
    certifications: {
      qualifelec: (siret: string) =>
        `/v3/qualifelec/etablissements/${siret}/certificats`,
      qualibat: (siret: string) =>
        `/v3/qualibat/etablissements/${siret}/certification_batiment`,
      opqibi: (siren: string) =>
        `/v3/opqibi/unites_legales/${siren}/certification_ingenierie`,
      cibtp: (siret: string) =>
        `/v3/cibtp/etablissements/${siret}/attestation_cotisations_conges_payes_chomage_intemperies`,
      cnetp: (siren: string) =>
        `/v3/cnetp/unites_legales/${siren}/attestation_cotisations_conges_payes_chomage_intemperies?context=Test+de+l%27API&object=Test+de+l%27API&recipient=10000001700010`,
    },
    mandatairesRCS: (siren: string) =>
      `/v3/infogreffe/rcs/unites_legales/${siren}/mandataires_sociaux`,
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
      rechercheBySiren: (siren: string) =>
        `https://www.bodacc.fr/pages/annonces-commerciales/?q.registre=registre:${siren}`,
    },
  },
  datagouv: {
    ess: 'https://tabular-api.data.gouv.fr/api/resources/57bc99ca-0432-4b46-8fcc-e76a35c9efaf/data/',
  },
  dataSubvention: {
    pageBySiren: (siren: string) =>
      `https://app.datasubvention.beta.gouv.fr/association/${siren}`,
  },
  apiDataSubvention: {
    documentation: 'https://api.datasubvention.beta.gouv.fr/docs',
    grants: (siren: string) =>
      `https://api.datasubvention.beta.gouv.fr/association/${siren}/grants`,
  },
  conventionsCollectives: {
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
    communes:
      'https://geo.api.gouv.fr/communes?fields=codesPostaux&format=json',
    departements:
      'https://geo.api.gouv.fr/departements?fields=code&format=json&zone=metro,drom,com',
    regions: 'https://geo.api.gouv.fr/regions?fields=nom,code',
    epcis: 'https://geo.api.gouv.fr/epcis?fields=nom,code',
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
  annuaireServicePublic: {
    ods: {
      metadata:
        'https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/',
      search:
        'https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/records',
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
    entrepriseInclusive: {
      site: 'https://lemarche.inclusion.beta.gouv.fr/prestataires/',
      api: {
        siren: 'https://lemarche.inclusion.beta.gouv.fr/api/siae/siren/',
        metadata: 'https://lemarche.inclusion.beta.gouv.fr/api/siae/kinds',
      },
    },
  },
  proxy: {
    ig: 'https://annuaire-entreprises-api-proxy.api.gouv.fr/ig/',
    rne: {
      immatriculation: {
        default: 'https://annuaire-entreprises-api-proxy.api.gouv.fr/rne/',
        fallback:
          'https://annuaire-entreprises-api-proxy.api.gouv.fr/rne/fallback/',
      },
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
    eori: 'https://annuaire-entreprises-api-proxy.api.gouv.fr/eori/',
  },
  rne: {
    portail: {
      pdf: 'https://data.inpi.fr/export/companies',
      entreprise: 'https://data.inpi.fr/entreprises/',
      account: 'https://data.inpi.fr/register',
    },
  },
  infogreffe: {
    portail: {
      home: 'https://www.infogreffe.fr',
      entreprise: 'https://www.infogreffe.fr/entreprise/',
    },
  },
  sireneInsee: {
    auth: 'https://auth.insee.net/auth/realms/apim-gravitee/protocol/openid-connect/token',
    avis: 'https://api-avis-situation-sirene.insee.fr/identification/pdf/',
    siren: 'https://api.insee.fr/api-sirene/prive/3.11/siren/',
    siret: 'https://api.insee.fr/api-sirene/prive/3.11/siret/',
  },
  rechercheEntreprise: {
    rechercheUniteLegale: 'https://recherche-entreprises.api.gouv.fr/search',
    idcc: {
      metadata: 'https://recherche-entreprises.api.gouv.fr/idcc/metadata',
      siren: 'https://recherche-entreprises.api.gouv.fr/idcc',
    },
  },
  tooling: {
    grist: 'https://grist.numerique.gouv.fr/api/docs/',
    matomo: {
      report: {
        copyPasteEvents:
          'https://stats.data.gouv.fr/index.php?module=API&format=json&idSite=145&period=range&method=Events.getNameFromCategoryId&idSubtable=1&module=API&showColumns=label,nb_events&filter_limit=9999&date=',
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
