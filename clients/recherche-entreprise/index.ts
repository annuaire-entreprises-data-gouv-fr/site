import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import { createEtablissementsList } from '#models/core/etablissements-list';
import { IETATADMINSTRATIF, estActif } from '#models/core/etat-administratif';
import {
  NotEnoughParamsException,
  createDefaultUniteLegale,
} from '#models/core/types';
import { ISearchResults } from '#models/search';
import SearchFilterParams from '#models/search/search-filter-params';
import { parseIntWithDefaultValue, verifySiren } from '#utils/helpers';
import {
  libelleFromCategoriesJuridiques,
  libelleFromCodeNAFWithoutNomenclature,
} from '#utils/helpers/formatting/labels';
import {
  etatFromEtatAdministratifInsee,
  parseDateCreationInsee,
  statuDiffusionFromStatutDiffusionInsee,
} from '#utils/helpers/insee-variables';
import { httpGet } from '#utils/network';
import { IResult, ISearchResponse } from './interface';
import {
  mapToDirigeantModel,
  mapToElusModel,
  mapToEtablissement,
  mapToImmatriculation,
  mapToSiege,
} from './mapToDomain';

type ClientSearchRechercheEntreprise = {
  searchTerms: string;
  pageResultatsRecherche: number;
  searchFilterParams?: SearchFilterParams;
  useCache?: boolean;
  inclureEtablissements?: boolean;
  inclureImmatriculation?: boolean;
  pageEtablissements?: number;
};

/**
 * Get results for searchTerms from Sirene ouverte API
 */
const clientSearchRechercheEntreprise = async ({
  searchTerms,
  searchFilterParams,
  useCache = false,
  inclureEtablissements = false,
  inclureImmatriculation = false,
  pageResultatsRecherche = 1,
  pageEtablissements = 1,
}: ClientSearchRechercheEntreprise): Promise<ISearchResults> => {
  const encodedTerms = encodeURIComponent(searchTerms);

  const route =
    process.env.ALTERNATIVE_SEARCH_ROUTE ||
    routes.rechercheEntreprise.rechercheUniteLegale;

  const filters = searchFilterParams?.toApiURI();

  if (!filters && (!encodedTerms || encodedTerms.length < 3)) {
    throw new NotEnoughParamsException();
  }

  let url = route;
  url += `?per_page=10&page=${pageResultatsRecherche}&q=${encodedTerms}&limite_matching_etablissements=3${
    searchFilterParams?.toApiURI() || ''
  }`;

  url += `&include_admin=slug`;

  if (inclureEtablissements) {
    url += `,etablissements`;
  }

  if (inclureImmatriculation) {
    url += `,immatriculation`;
  }

  if (inclureEtablissements && pageEtablissements) {
    url += `&page_etablissements=${pageEtablissements}`;
  }

  url += `&mtm_campaign=annuaire-entreprises-site`;

  const timeout = constants.timeout.L;

  const results = await httpGet<ISearchResponse>(url, {
    timeout,
    headers: { referer: 'annuaire-entreprises-site' },
    useCache,
  });

  if (!results.results || results.results.length === 0) {
    throw new HttpNotFound('No results');
  }
  return mapToDomainObjectNew(results, pageEtablissements);
};

const mapToDomainObjectNew = (
  data: ISearchResponse,
  pageEtablissements: number
): ISearchResults => {
  const { total_results = 0, total_pages = 0, results = [], page } = data;

  return {
    currentPage: parseIntWithDefaultValue(page as string, 1),
    resultCount: total_results,
    pageCount: total_pages,
    results: results.map((r) => mapToUniteLegale(r, pageEtablissements)),
  };
};

const mapToUniteLegale = (result: IResult, pageEtablissements: number) => {
  const {
    nature_juridique,
    siege,
    dirigeants,
    complements,
    immatriculation,
    matching_etablissements,
    categorie_entreprise,
    annee_categorie_entreprise = null,
    tranche_effectif_salarie = null,
    annee_tranche_effectif_salarie = null,
    date_creation,
    date_fermeture,
    date_mise_a_jour,
    date_mise_a_jour_insee,
    date_mise_a_jour_rne,
    statut_diffusion,
    etablissements = [],
    caractere_employeur = '',
    etat_administratif,
    nombre_etablissements_ouverts,
  } = result;

  const {
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
    est_association = false,
    liste_idcc = [],
    est_siae = false,
    type_siae = '',
  } = complements || {};

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

  const etablissementSiege = mapToSiege(siege, est_entrepreneur_individuel);

  const matchingEtablissements = matching_etablissements.map(
    (matchingEtablissement) =>
      mapToEtablissement(matchingEtablissement, est_entrepreneur_individuel)
  );

  // case no open etablisssment
  let etatAdministratif = etatFromEtatAdministratifInsee(
    etat_administratif,
    siren
  );
  if (estActif({ etatAdministratif }) && nombre_etablissements_ouverts === 0) {
    etatAdministratif = IETATADMINSTRATIF.ACTIF_ZERO_ETABLISSEMENT;
  }

  const etablissementsList = createEtablissementsList(
    etablissements.length > 0
      ? etablissements.map((e) =>
          mapToEtablissement(e, est_entrepreneur_individuel)
        )
      : [etablissementSiege],
    pageEtablissements,
    result.nombre_etablissements,
    result.nombre_etablissements_ouverts
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
      statut_diffusion || 'O',
      siren
    ),
    nomComplet,
    libelleNatureJuridique: libelleFromCategoriesJuridiques(nature_juridique),
    categorieEntreprise: categorie_entreprise,
    anneeCategorieEntreprise: annee_categorie_entreprise,
    trancheEffectif:
      tranche_effectif_salarie ??
      (caractere_employeur === 'N' ? caractere_employeur : null),
    anneeTrancheEffectif: annee_tranche_effectif_salarie,
    chemin: result.slug || result.siren,
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
      estAssociation: est_association,
      estUai: est_uai,
      estEntrepriseInclusive: est_siae,
      typeEntrepriseInclusive: type_siae,
    },
    immatriculation: mapToImmatriculation(immatriculation),
    association: {
      idAssociation: identifiant_association,
      data: null,
    },
    colter,
    dateCreation: parseDateCreationInsee(date_creation),
    dateDerniereMiseAJour: date_mise_a_jour || '',
    dateMiseAJourInsee: date_mise_a_jour_insee || '',
    dateMiseAJourInpi: date_mise_a_jour_rne || '',
    dateFermeture: date_fermeture ?? '',
    listeIdcc: liste_idcc || [],
  };
};

export default stubClientWithSnapshots({
  clientSearchRechercheEntreprise,
});
