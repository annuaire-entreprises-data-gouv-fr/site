import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import {
  etatFromEtatAdministratifInsee,
  statuDiffusionFromStatutDiffusionInsee,
} from '#clients/sirene-insee/helpers';
import constants from '#models/constants';
import { createEtablissementsList } from '#models/etablissements-list';
import { IETATADMINSTRATIF, estActif } from '#models/etat-administratif';
import { IEtatCivil, IPersonneMorale } from '#models/immatriculation';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IConventionCollective,
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
  extractSirenFromSiret,
  extractNicFromSiret,
} from '#utils/helpers';
import {
  getConventionCollectives,
  libelleFromCategoriesJuridiques,
  libelleFromCodeNAFWithoutNomenclature,
} from '#utils/helpers/formatting/labels';
import { httpGet } from '#utils/network';
import {
  ISearchResponse,
  IResult,
  ISiege,
  IMatchingEtablissement,
  IDirigeant,
} from './interface';

type ClientSearchRechercheEntreprise = {
  searchTerms: string;
  page: number;
  searchFilterParams?: SearchFilterParams;
  fallbackOnStaging?: boolean;
  useCache?: boolean;
  inclureEtablissements?: boolean;
};

/**
 * Get results for searchTerms from Sirene ouverte API
 */
const clientSearchRechercheEntreprise = async ({
  searchTerms,
  page,
  searchFilterParams,
  fallbackOnStaging = false,
  useCache = false,
  inclureEtablissements = false,
}: ClientSearchRechercheEntreprise): Promise<ISearchResults> => {
  const encodedTerms = encodeURIComponent(searchTerms);

  const route =
    process.env.ALTERNATIVE_SEARCH_ROUTE ||
    (fallbackOnStaging
      ? routes.rechercheEntreprise.rechercheUniteLegaleStaging
      : routes.rechercheEntreprise.rechercheUniteLegale);

  const filters = searchFilterParams?.toApiURI();

  if (!filters && (!encodedTerms || encodedTerms.length < 3)) {
    throw new NotEnoughParamsException('');
  }

  const url = `${route}?per_page=10&page=${page}&q=${encodedTerms}&limite_matching_etablissements=3${
    searchFilterParams?.toApiURI() || ''
  }&include_admin=slug${inclureEtablissements ? ',etablissements' : ''}`;

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
      collectivite_territoriale = null,
      est_bio = false,
      egapro_renseignee = false,
      est_entrepreneur_individuel = false,
      est_organisme_formation = false,
      est_qualiopi = false,
      est_entrepreneur_spectacle = false,
      est_ess = false,
      est_finess = false,
      est_rge = false,
      est_service_public = false,
      est_uai = false,
      est_societe_mission = false,
      identifiant_association = null,
      statut_entrepreneur_spectacle = '',
    },
    matching_etablissements,
    categorie_entreprise,
    annee_categorie_entreprise = null,
    tranche_effectif_salarie = null,
    annee_tranche_effectif_salarie = null,
    date_creation = '',
    date_mise_a_jour = '',
    statut_diffusion = 'O',
    etablissements = [],
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

  const etablissementSiege = mapToEtablissement(siege);

  const matchingEtablissements = matching_etablissements.map(
    (matchingEtablissement) => mapToEtablissement(matchingEtablissement)
  );

  // case no open etablisssment
  let etatAdministratif = etatFromEtatAdministratifInsee(
    result.etat_administratif,
    siren
  );
  if (
    estActif({ etatAdministratif }) &&
    result.nombre_etablissements_ouverts === 0
  ) {
    etatAdministratif = IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT;
  }

  // when unknwon, dateCreation is set to 1900-01-01 by Insee instead of null
  const dateCreation = date_creation === '1900-01-01' ? '' : date_creation;

  const etablissementsList = createEtablissementsList(
    etablissements.length > 0
      ? etablissements.map(mapToEtablissement)
      : [etablissementSiege],
    // hard code 1 for page as we dont paginate etablissement on recherche-entreprise
    1,
    result.nombre_etablissements
  );

  return {
    ...createDefaultUniteLegale(siren),
    siege: etablissementSiege,
    matchingEtablissements,
    nombreEtablissements: result.nombre_etablissements || 1,
    nombreEtablissementsOuverts: result.nombre_etablissements_ouverts || 0,
    etablissements: etablissementsList,
    etatAdministratif,
    statutDiffusion: statuDiffusionFromStatutDiffusionInsee(
      statut_diffusion,
      siren
    ),
    nomComplet,
    libelleNatureJuridique: libelleFromCategoriesJuridiques(nature_juridique),
    categorieEntreprise: categorie_entreprise,
    anneeCategorieEntreprise: annee_categorie_entreprise,
    trancheEffectif: tranche_effectif_salarie,
    anneeTrancheEffectif: annee_tranche_effectif_salarie,
    chemin: result.slug_annuaire_entreprises || result.siren,
    natureJuridique: nature_juridique || '',
    libelleActivitePrincipale: libelleFromCodeNAFWithoutNomenclature(
      result.activite_principale,
      false
    ),
    activitePrincipale: result.activite_principale,
    dirigeants: dirigeants.map(mapToDirigeantModel),
    complements: {
      estBio: est_bio,
      estEss: est_ess,
      estServicePublic: est_service_public,
      estEntrepreneurIndividuel: est_entrepreneur_individuel,
      estEntrepreneurSpectacle: est_entrepreneur_spectacle,
      statutEntrepreneurSpectacle: statut_entrepreneur_spectacle,
      estFiness: est_finess,
      egaproRenseignee: egapro_renseignee,
      estRge: est_rge,
      estOrganismeFormation: est_organisme_formation,
      estSocieteMission: est_societe_mission,
      estQualiopi: est_qualiopi,
      estUai: est_uai,
    },
    association: {
      idAssociation: identifiant_association,
      data: null,
    },
    colter,
    dateCreation,
    dateDerniereMiseAJour: date_mise_a_jour,
    conventionsCollectives: etablissementsList.all.flatMap(
      (e) => e.conventionsCollectives
    ),
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
    commune = '',
    code_postal = '',
    libelle_commune = '',
    adresse,
    liste_enseignes,
    etat_administratif,
    est_siege = false,
    nom_commercial = '',
    activite_principale = '',
    date_creation = '',
    date_debut_activite = '',
    liste_idcc,
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
    siren: extractSirenFromSiret(siret),
    nic: extractNicFromSiret(siret),
    siret: verifySiret(siret),
    adresse,
    codePostal: code_postal,
    commune: libelle_commune,
    adressePostale,
    latitude,
    longitude,
    estSiege: est_siege,
    etatAdministratif,
    denomination: nom_commercial,
    libelleActivitePrincipale:
      libelleFromCodeNAFWithoutNomenclature(activite_principale),
    activitePrincipale: activite_principale,
    dateCreation: date_creation,
    dateDebutActivite: date_debut_activite,
    conventionsCollectives: (liste_idcc || [])
      .map((idcc) => {
        return getConventionCollectives(idcc, siret);
      })
      .filter((cc): cc is IConventionCollective => !!cc),
  };
};

export default clientSearchRechercheEntreprise;
