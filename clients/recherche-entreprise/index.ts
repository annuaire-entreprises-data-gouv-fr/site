import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { etatFromEtatAdministratifInsee } from '#clients/sirene-insee/helpers';
import constants from '#models/constants';
import { IEtatCivil, IPersonneMorale } from '#models/immatriculation/rncs';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IEtablissement,
  NotEnoughParamsException,
} from '#models/index';
import { ISearchResult, ISearchResults } from '#models/search';
import SearchFilterParams from '#models/search-filter-params';
import {
  verifySiren,
  formatFirstNames,
  parseIntWithDefaultValue,
  verifySiret,
} from '#utils/helpers';
import { libelleFromCodeNAFWithoutNomenclature } from '#utils/labels';
import { httpGet } from '#utils/network';

interface ISirenOuverteEtablissement {
  activite_principale: string;
  adresse: string;
  code_postal: string;
  est_siege: boolean;
  etat_administratif: string;
  geo_id: string;
  latitude: string;
  enseignes: string[];
  liste_finess: [];
  liste_idcc: [];
  liste_rge: [];
  liste_uai: [];
  longitude: string;
  nom_commercial: string;
  siret: string;
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

  const filters = searchFilterParams?.toApiURI();

  if (!filters && (!encodedTerms || encodedTerms.length < 3)) {
    throw new NotEnoughParamsException('');
  }

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
    siege: mapToEtablissement(siege),
    matchingEtablissements: matching_etablissements
      .map((e) => mapToEtablissement(e))
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
  etablissement: ISirenOuverteEtablissement
): IEtablissement => {
  const {
    siret,
    latitude = '0',
    longitude = '0',
    adresse,
    enseignes,
    etat_administratif,
    est_siege,
  } = etablissement;

  const enseigne = enseignes.join(' ');

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
    estSiege: est_siege,
    etatAdministratif,
  };
};

export default clientSearchSireneOuverte;
