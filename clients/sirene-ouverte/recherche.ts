import { ISearchResult, ISearchResults } from '../../models/search';
import constants from '../../models/constants';
import {
  formatAdresse,
  formatFirstNames,
  parseIntWithDefaultValue,
} from '../../utils/helpers/formatting';
import { libelleFromCodeNAFWithoutNomenclature } from '../../utils/labels';
import { httpGet } from '../../utils/network';
import { HttpNotFound } from '../exceptions';
import routes from '../routes';
import SearchFilterParams from '../../models/search-filter-params';
import { IEtatCivil, IPersonneMorale } from '../../models/immatriculation/rncs';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
} from '../../models';
import { verifySiren, verifySiret } from '../../utils/helpers/siren-and-siret';

interface ISireneOuverteUniteLegaleResultat {
  siren: string;
  siege: {
    siret: string;
    date_creation: string;
    tranche_effectif_salarie: string;
    date_debut_activite: string;
    etat_administratif: string;
    activite_principale: string;
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
    longitude: string;
    latitude: string;
    activite_principale_registre_metier: string;
  };
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
    est_ess: boolean;
    est_entrepreneur_individuel: boolean;
    identifiant_association: string;
    collectivite_territoriale: {
      code: string;
      code_insee: string;
      elus: ISireneOuverteDirigeant[];
      niveau: string;
    };
  };
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
const getResults = async (
  searchTerms: string,
  page: number,
  searchFilterParams?: SearchFilterParams,
  fallbackOnStaging = false
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
    : constants.timeout.M;

  const response = await httpGet(url, {
    timeout,
    headers: { referer: 'annuaire-entreprises-site' },
  });

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
    siege: {
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
      latitude = '0',
      longitude = '0',
    },
    dirigeants,
    complements: {
      est_ess = false,
      est_entrepreneur_individuel = false,
      identifiant_association = null,
      collectivite_territoriale = null,
    },
  } = result;

  const nomComplet = (result.nom_complet || 'Nom inconnu').toUpperCase();

  const siren = verifySiren(result.siren);
  const siret = verifySiret(result.siege.siret);

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

  const siege = {
    ...createDefaultEtablissement(),
    siret,
    adresse,
    latitude,
    longitude,
  };

  return {
    ...createDefaultUniteLegale(siren),
    siege,
    estActive: result.etat_administratif === 'A',
    nomComplet,
    nombreEtablissements: result.nombre_etablissements || 1,
    nombreEtablissementsOuverts: result.nombre_etablissements_ouverts || 0,
    chemin: result.siren,
    natureJuridique: nature_juridique,
    libelleActivitePrincipale: libelleFromCodeNAFWithoutNomenclature(
      result.activite_principale,
      false
    ),
    dirigeants: dirigeants.map(mapToDirigeantModel),
    complements: {
      estEss: est_ess,
      estEntrepreneurIndividuel: est_entrepreneur_individuel,
    },
    association: {
      idAssociation: identifiant_association,
    },
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

export default getResults;
