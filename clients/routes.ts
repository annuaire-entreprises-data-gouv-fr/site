const routes = {
  espaceAgent: {
    documents: {
      download: '/api/download/espace-agent/documents/',
      inpiPdf: '/api/inpi-pdf',
    },
  },
  ademe: {
    bilanGes:
      'https://koumoul.com/data-fair/api/v1/datasets/gnzo7xgwv5d271w1t0yw8ynb/lines',
  },
  apiEntreprise: {
    association: (siren: string) =>
      `/v4/djepva/api-association/associations/${siren}`,
    beneficiaires: (siren: string) =>
      `/v3/inpi/rne/unites_legales/${siren}/beneficiaires_effectifs`,
    carteProfessionnelleTravauxPublics: (siren: string) =>
      `/v3/fntp/unites_legales/${siren}/carte_professionnelle_travaux_publics`,
    certifications: {
      cibtp: (siret: string) =>
        `/v3/cibtp/etablissements/${siret}/attestation_cotisations_conges_payes_chomage_intemperies`,
      cnetp: (siren: string) =>
        `/v3/cnetp/unites_legales/${siren}/attestation_cotisations_conges_payes_chomage_intemperies`,
      opqibi: (siren: string) =>
        `/v3/opqibi/unites_legales/${siren}/certification_ingenierie`,
      probtp: (siret: string) =>
        `/v3/probtp/etablissements/${siret}/attestation_cotisations_retraite`,
      qualibat: (siret: string) =>
        `/v3/qualibat/etablissements/${siret}/certification_batiment`,
      qualifelec: (siret: string) =>
        `/v3/qualifelec/etablissements/${siret}/certificats`,
    },
    conformite: {
      fiscale: (siren: string) =>
        `/v4/dgfip/unites_legales/${siren}/attestation_fiscale`,
      vigilance: (siren: string) =>
        `/v4/urssaf/unites_legales/${siren}/attestation_vigilance`,
      msa: (siret: string) =>
        `/v3/msa/etablissements/${siret}/conformite_cotisations`,
    },
    dgfip: {
      chiffreAffaires: (siret: string) =>
        `/v3/dgfip/etablissements/${siret}/chiffres_affaires`,
      liassesFiscales: (siren: string, year?: string) =>
        `/v3/dgfip/unites_legales/${siren}/liasses_fiscales/${year}`,
      liensCapitalistiques: (siren: string, year?: string) =>
        `/v3/dgfip/unites_legales/${siren}/liens_capitalistiques/${year}`,
    },
    banqueDeFrance: {
      bilans: (siren: string) =>
        `/v3/banque_de_france/unites_legales/${siren}/bilans`,
    },
    mandatairesRCS: (siren: string) =>
      `/v3/infogreffe/rcs/unites_legales/${siren}/mandataires_sociaux`,
    effectifs: {
      annuels: (siren: string, year: string | number) =>
        `/v3/gip_mds/unites_legales/${siren}/effectifs_annuels/${year}`,
    },
  },
  ban: 'https://api-adresse.data.gouv.fr/search',
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
    alimConfiance:
      'https://tabular-api.data.gouv.fr/api/resources/fdfabe62-a581-41a1-998f-73fc53da3398/data/',
    ess: 'https://tabular-api.data.gouv.fr/api/resources/57bc99ca-0432-4b46-8fcc-e76a35c9efaf/data/',
    dpo: 'https://tabular-api.data.gouv.fr/api/resources/c5d02b42-1008-4406-83f5-3a81c8b936a3/data/',
  },
  dataSubvention: {
    pageBySirenOrIdRna: (sirenOrIdRna: string) =>
      `https://app.datasubvention.beta.gouv.fr/association/${sirenOrIdRna}`,
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
    communes: 'https://geo.api.gouv.fr/communes',
    departements: 'https://geo.api.gouv.fr/departements',
    regions: 'https://geo.api.gouv.fr/regions',
    epcis: 'https://geo.api.gouv.fr/epcis',
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
        getBySiren: (siren: string) =>
          `https://lemarche.inclusion.beta.gouv.fr/api/siae/siren/${siren}`,
        metadata: 'https://lemarche.inclusion.beta.gouv.fr/api/siae/kinds',
      },
    },
  },
  inpi: {
    api: {
      rne: {
        login: 'https://registre-national-entreprises.inpi.fr/api/sso/login',
        documents: {
          list: 'https://registre-national-entreprises.inpi.fr/api/companies/',
          download: {
            actes: 'https://registre-national-entreprises.inpi.fr/api/actes/',
            bilans: 'https://registre-national-entreprises.inpi.fr/api/bilans/',
          },
        },
      },
    },
  },
  proxy: {
    ig: (siren: string) =>
      `https://annuaire-entreprises-api-proxy.api.gouv.fr/ig/${siren}`,
    rne: {
      immatriculation: {
        default: (siren: string) =>
          `https://annuaire-entreprises-api-proxy.api.gouv.fr/rne/${siren}`,
        fallback: (siren: string) =>
          `https://annuaire-entreprises-api-proxy.api.gouv.fr/rne/fallback/${siren}`,
      },
    },
    association: (rnaOrSiren: string) =>
      `https://annuaire-entreprises-api-proxy.api.gouv.fr/association/${rnaOrSiren}`,
    tva: (tvaNumber: string) =>
      `https://annuaire-entreprises-api-proxy.api.gouv.fr/tva/${tvaNumber}`,
    eori: (siret: string) =>
      `https://annuaire-entreprises-api-proxy.api.gouv.fr/eori/${siret}`,
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
    getBySiren: (siren: string) =>
      `https://api.insee.fr/api-sirene/prive/3.11/siren/${siren}`,
    getBySiret: (siret: string) =>
      `https://api.insee.fr/api-sirene/prive/3.11/siret/${siret}`,
    listEtablissements: 'https://api.insee.fr/api-sirene/prive/3.11/siret',
  },
  rechercheEntreprise: {
    rechercheUniteLegale: 'https://recherche-entreprises.api.gouv.fr/search',
    idcc: {
      metadata: 'https://recherche-entreprises.api.gouv.fr/idcc/metadata',
      getBySiren: (siren: string) =>
        `https://recherche-entreprises.api.gouv.fr/idcc/${siren}`,
    },
    lastModified:
      'https://recherche-entreprises.api.gouv.fr/sources/last_modified',
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
    monitoring: {
      getBySlug: (slug: string) =>
        `https://updown.io/api/checks/${slug}/downtimes`,
    },
  },
  dRoles: {
    auth: {
      token: '/auth/token',
    },
    users: {
      getByEmail: (email: string) =>
        `/users/search?email=${encodeURIComponent(email)}`,
    },
    groups: {
      getGroupsByEmail: (userEmail: string, userSub: string) =>
        `/groups/search?user_email=${encodeURIComponent(
          userEmail
        )}&user_sub=${userSub}`,
      updateName: (groupId: number, groupName: string, actingUserSub: string) =>
        `/groups/${groupId}?group_name=${encodeURIComponent(
          groupName
        )}&acting_user_sub=${actingUserSub}`,
      addUserToGroup: (groupId: number, actingUserSub: string) =>
        `/groups/${groupId}/users?acting_user_sub=${actingUserSub}`,
      updateUserFromGroup: (
        groupId: number,
        userId: number,
        roleId: number,
        actingUserSub: string
      ) =>
        `/groups/${groupId}/users/${userId}?role_id=${roleId}&acting_user_sub=${actingUserSub}`,
      removeUserFromGroup: (
        groupId: number,
        userId: number,
        actingUserSub: string
      ) =>
        `/groups/${groupId}/users/${userId}?acting_user_sub=${actingUserSub}`,
    },
    roles: {
      get: '/roles',
    },
  },
};

export default routes;
