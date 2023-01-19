import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { etatFromEtatAdministratifInsee } from '#clients/sirene-insee/helpers';
import constants from '#models/constants';
import { IEtatCivil, IPersonneMorale } from '#models/immatriculation/rncs';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IEtablissement,
} from '#models/index';
import { ISearchResult, ISearchResults } from '#models/search';
import SearchFilterParams from '#models/search-filter-params';
import {
  verifySiren,
  formatAdresse,
  formatFirstNames,
  parseIntWithDefaultValue,
  verifySiret,
  agregateTripleFields,
} from '#utils/helpers';
import { libelleFromCodeNAFWithoutNomenclature } from '#utils/labels';
import { httpGet } from '#utils/network';

interface ISirenOuverteEtablissement {
  siret: string;
  longitude: string;
  latitude: string;
  activite_principale: string;
  date_creation: string;
  tranche_effectif_salarie: string;
  date_debut_activite: string;
  etat_administratif: string;
  enseigne_1: string;
  enseigne_2: string;
  enseigne_3: string;
  numero_voie: string;
  type_voie: string;
  libelle_voie: string;
  code_postal: string;
  libelle_commune: string;
  libelle_cedex: string;
  libelle_commune_etranger: string;
  code_pays_etranger: string;
  libelle_pays_etranger: string;
  indice_repetition: string;
  complement_adresse: string;
  commune: string;
  activite_principale_registre_metier: string;
}

interface ISireneOuverteUniteLegaleResultat {
  siren: string;
  siege: ISirenOuverteEtablissement;
  date_creation: string;
  categorie_entreprise: string;
  etat_administratif: string;
  nom_raison_sociale: string;
  nature_juridique: string;
  activite_principale: string;
  economie_sociale_solidaire: string;
  nom_complet: string;
  nombre_etablissements: number;
  nombre_etablissements_ouverts: number;
  is_entrepreneur_individuel: true;
  dirigeants: ISireneOuverteDirigeant[];
  complements: {
    identifiant_association: string;
    convention_collective_renseignee: boolean;
    est_entrepreneur_individuel: boolean;
    est_entrepreneur_spectacle: boolean;
    est_ess: boolean;
    est_finess: boolean;
    est_rge: boolean;
    est_uai: boolean;
    collectivite_territoriale: {
      code: string;
      code_insee: string;
      elus: ISirenOuverteEtablissement[];
      niveau: string;
    };
  };
  matching_etablissements: ISirenOuverteEtablissement[];
}

interface ISireneOuverteDirigeant {
  prenoms?: string;
  nom?: string;
  annee_de_naissance?: string;
  qualite?: string;
  fonction?: string;
  sexe?: string;
  siren?: string;
  denomination?: string;
  sigle?: string;
}

interface ISireneOuverteSearchResults {
  page: string;
  total_results: number;
  total_pages: number;
  currentPage?: string;
  results: ISireneOuverteUniteLegaleResultat[];
}

/**
 * Get results for searchTerms from Sirene ouverte API
 */
const clientSearchSireneOuverte = async (
  searchTerms: string,
  page: number,
  searchFilterParams?: SearchFilterParams,
  fallbackOnStaging = false,
  useCache = true
): Promise<ISearchResults> => {
  const encodedTerms = encodeURIComponent(searchTerms);

  const route =
    process.env.ALTERNATIVE_SEARCH_ROUTE ||
    (fallbackOnStaging
      ? routes.sireneOuverte.rechercheUniteLegaleStaging
      : routes.sireneOuverte.rechercheUniteLegale);

  const url = `${route}?per_page=10&page=${page}&q=${encodedTerms}${
    searchFilterParams?.toApiURI() || ''
  }`;
  const timeout = fallbackOnStaging
    ? constants.timeout.XL
    : constants.timeout.L;

  const response = await httpGet(
    url,
    {
      timeout,
      headers: { referer: 'annuaire-entreprises-site' },
    },
    useCache
  );

  const results = (response.data || []) as any;

  if (
    results.length === 0 ||
    !results.results ||
    results.results.length === 0
  ) {
    throw new HttpNotFound('No results');
  }
  return mapToDomainObjectNew(results);
};

const mapToDomainObjectNew = (
  data: ISireneOuverteSearchResults
): ISearchResults => {
  const { total_results = 0, total_pages = 0, results = [], page } = data;

  return {
    currentPage: page ? parseIntWithDefaultValue(page) : 1,
    resultCount: total_results,
    pageCount: total_pages,
    results: results.map(mapToUniteLegale),
  };
};

const mapToUniteLegale = (
  result: ISireneOuverteUniteLegaleResultat
): ISearchResult => {
  const {
    nature_juridique,
    siege,
    dirigeants,
    complements: {
      est_entrepreneur_individuel = false,
      identifiant_association = null,
      collectivite_territoriale = null,
      est_ess = false,
      est_entrepreneur_spectacle = false,
      est_finess = false,
      est_rge = false,
      est_uai = false,
    },
    matching_etablissements,
  } = result;

  const nomComplet = (result.nom_complet || 'Nom inconnu').toUpperCase();

  const siren = verifySiren(result.siren);

  const colter = collectivite_territoriale
    ? {
        codeColter: collectivite_territoriale.code || null,
        codeInsee: collectivite_territoriale.code_insee || null,
        niveau: collectivite_territoriale.niveau || null,
        elus: (collectivite_territoriale?.elus || []).map(mapToElusModel),
      }
    : { codeColter: null };

  return {
    ...createDefaultUniteLegale(siren),
    siege: mapToEtablissement(siege, siege.siret),
    matchingEtablissements: matching_etablissements
      .map((e) => mapToEtablissement(e, siege.siret))
      .filter((e) => e.siret !== siege.siret),
    etatAdministratif: etatFromEtatAdministratifInsee(
      result.etat_administratif,
      siren
    ),
    nomComplet,
    nombreEtablissements: result.nombre_etablissements || 1,
    nombreEtablissementsOuverts: result.nombre_etablissements_ouverts || 0,
    chemin: result.siren,
    natureJuridique: nature_juridique || '',
    libelleActivitePrincipale: libelleFromCodeNAFWithoutNomenclature(
      result.activite_principale,
      false
    ),
    dirigeants: dirigeants.map(mapToDirigeantModel),
    complements: {
      estEss: est_ess,
      estEntrepreneurIndividuel: est_entrepreneur_individuel,
      estEntrepreneurSpectacle: est_entrepreneur_spectacle,
      estFiness: est_finess,
      estRge: est_rge,
      estUai: est_uai,
    },
    association: {
      idAssociation: identifiant_association,
    },
    colter,
  };
};

const mapToDirigeantModel = (
  dirigeantRaw: ISireneOuverteDirigeant
): IEtatCivil | IPersonneMorale => {
  const {
    siren = '',
    sigle = '',
    denomination = '',
    prenoms = '',
    nom = '',
    // annee_de_naissance = '',
    qualite = '',
  } = dirigeantRaw;
  if (!!siren) {
    return {
      siren,
      denomination: `${denomination}${sigle ? ` (${sigle})` : ''}`,
      role: qualite,
    } as IPersonneMorale;
  }

  return {
    sexe: null,
    nom: (nom || '').toUpperCase(),
    prenom: formatFirstNames((prenoms || '').split(' '), 1),
    role: qualite,
    dateNaissancePartial: '',
    dateNaissanceFull: '',
    lieuNaissance: '',
  };
};

const mapToElusModel = (eluRaw: any): IEtatCivil => {
  const { nom, prenoms, annee_de_naissance, fonction, sexe } = eluRaw;

  return {
    sexe,
    nom: (nom || '').toUpperCase(),
    prenom: formatFirstNames((prenoms || '').split(' '), 1),
    role: fonction,
    dateNaissancePartial: annee_de_naissance,
    dateNaissanceFull: '',
    lieuNaissance: '',
  };
};

const mapToEtablissement = (
  etablissement: ISirenOuverteEtablissement,
  siretSiege: string
): IEtablissement => {
  const {
    siret,
    latitude = '0',
    longitude = '0',
    complement_adresse,
    numero_voie,
    indice_repetition,
    type_voie,
    libelle_voie,
    code_postal,
    libelle_commune,
    libelle_cedex,
    libelle_commune_etranger,
    code_pays_etranger,
    libelle_pays_etranger,
    enseigne_1,
    enseigne_2,
    enseigne_3,
    etat_administratif,
  } = etablissement;

  const enseigne =
    agregateTripleFields(enseigne_1, enseigne_2, enseigne_3) || '';

  const adresse = formatAdresse({
    complement: complement_adresse,
    numeroVoie: numero_voie,
    indiceRepetition: indice_repetition,
    typeVoie: type_voie,
    libelleVoie: libelle_voie,
    codePostal: code_postal,
    libelleCommune: libelle_commune,
    libelleCommuneCedex: libelle_cedex,
    libelleCommuneEtranger: libelle_commune_etranger,
    codePaysEtranger: code_pays_etranger,
    libellePaysEtranger: libelle_pays_etranger,
  });

  const adressePostale = adresse
    ? `${enseigne ? `${enseigne}, ` : ''}${adresse}`
    : '';

  const etatAdministratif = etatFromEtatAdministratifInsee(
    etat_administratif,
    siret
  );
  return {
    ...createDefaultEtablissement(),
    siret: verifySiret(siret),
    adresse,
    adressePostale,
    latitude,
    longitude,
    estSiege: siret === siretSiege,
    etatAdministratif,
  };
};

export default clientSearchSireneOuverte;
