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
  verifySiret,
  parseIntWithDefaultValue,
} from '#utils/helpers';
import { libelleFromCodeNAFWithoutNomenclature } from '#utils/labels';
import { httpGet } from '#utils/network';
import {
  ISearchResponse,
  IResult,
  ISiege,
  IMatchingEtablissement,
  IDirigeant,
} from './interface';

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

  const url = `${route}?per_page=10&page=${page}&q=${encodedTerms}&limite_matching_etablissements=3${
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

  const results = response.data as ISearchResponse;

  if (!results.results || results.results.length === 0) {
    throw new HttpNotFound('No results');
  }
  return mapToDomainObjectNew(results);
};

const mapToDomainObjectNew = (data: ISearchResponse): ISearchResults => {
  const { total_results = 0, total_pages = 0, results = [], page } = data;

  return {
    currentPage: parseIntWithDefaultValue(page as string, 1),
    resultCount: total_results,
    pageCount: total_pages,
    results: results.map(mapToUniteLegale),
  };
};

const mapToUniteLegale = (result: IResult): ISearchResult => {
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
      .map((matchingEtablissement) => mapToEtablissement(matchingEtablissement))
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
  dirigeant: IDirigeant
): IEtatCivil | IPersonneMorale => {
  const {
    siren = '',
    sigle = '',
    denomination = '',
    prenoms = '',
    nom = '',
    qualite = '',
  } = dirigeant;

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
  etablissement: ISiege | IMatchingEtablissement
): IEtablissement => {
  const {
    siret,
    latitude = '0',
    longitude = '0',
    adresse,
    liste_enseignes,
    etat_administratif,
    est_siege,
    nom_commercial,
  } = etablissement;

  const enseigne = (liste_enseignes || []).join(' ');

  const adressePostale = adresse
    ? `${
        enseigne ? `${enseigne}, ` : nom_commercial ? `${nom_commercial}, ` : ''
      }${adresse}`
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
