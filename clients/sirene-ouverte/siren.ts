import { IUniteLegale } from '../../models';
import { isEntrepreneurIndividuelFromNatureJuridique } from '../../utils/helpers/checks';
import {
  formatAdresse,
  libelleFromCategoriesJuridiques,
  libelleFromCodeEffectif,
  libelleFromCodeNaf,
} from '../../utils/labels';
import { fetchWithTimeout } from '../../utils/network/fetch-with-timeout';
import { HttpNotFound, HttpServerError } from '../exceptions';
import routes from '../routes';
import {
  ISireneOuverteEtablissement,
  mapSireneOuverteEtablissementToDomainObject,
} from './siret';

/**
 * GET UNITE LEGALE
 */
interface ISireneOuverteUniteLegale {
  etablissement_siege: ISireneOuverteEtablissement[];
  etablissements: ISireneOuverteEtablissement[];
  date_creation: string;
  date_creation_entreprise: string;
  date_mise_a_jour: string;
  numero_tva_intra: string;
  date_debut_activite: string;
  tranche_effectif_salarie_entreprise: string;
  nature_juridique_entreprise: string;
  nombre_etablissements: number;
  nom_complet: string;
  nom_url: string;
  numero_voie: string;
  indice_repetition: string;
  type_voie: string;
  libelle_commune: string;
  code_postal: string;
  libelle_voie: string;
  activite_principale_entreprise: string;
}
interface ISireneOuverteUniteLegaleResponse {
  unite_legale: ISireneOuverteUniteLegale[];
}

const getUniteLegaleSireneOuverte = async (
  siren: string,
  page = 1
): Promise<IUniteLegale> => {
  const response = await fetchWithTimeout(
    routes.sireneOuverte.uniteLegale + siren + '&page=' + page
  );

  if (response.status !== 200) {
    throw new HttpServerError(500, await response.text());
  }

  let uniteLegale;

  try {
    // Sirene ouverte does not return actual 404, just empty objects/arrays
    const result = (
      await response.json()
    )[0] as ISireneOuverteUniteLegaleResponse;

    uniteLegale = result.unite_legale[0];

    if (!uniteLegale) {
      throw new Error();
    }
  } catch (e) {
    throw new HttpNotFound(404, siren);
  }

  return mapToDomainObject(siren, uniteLegale, page);
};

const mapToDomainObject = (
  siren: string,
  uniteLegale: ISireneOuverteUniteLegale,
  page: number
): IUniteLegale => {
  const siege = mapSireneOuverteEtablissementToDomainObject(
    uniteLegale.etablissement_siege[0]
  );

  const listOfEtablissement = uniteLegale.etablissements.map(
    mapSireneOuverteEtablissementToDomainObject
  );

  if (!listOfEtablissement || listOfEtablissement.length === 0) {
    throw new HttpServerError(500, `No etablissements found`);
  }

  const {
    date_creation_entreprise,
    date_mise_a_jour,
    numero_tva_intra,
    date_debut_activite,
    nom_complet,
    nom_url,
    numero_voie,
    indice_repetition,
    type_voie,
    libelle_commune,
    code_postal,
    libelle_voie,
    nombre_etablissements,
    nature_juridique_entreprise,
    tranche_effectif_salarie_entreprise,
    activite_principale_entreprise,
  } = uniteLegale;

  return {
    siren,
    numeroTva: numero_tva_intra,
    association: null,
    siege,
    activitePrincipale: activite_principale_entreprise,
    libelleActivitePrincipale: libelleFromCodeNaf(
      activite_principale_entreprise
    ),
    natureJuridique: nature_juridique_entreprise,
    libelleNatureJuridique: libelleFromCategoriesJuridiques(
      nature_juridique_entreprise
    ),
    trancheEffectif: tranche_effectif_salarie_entreprise,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      tranche_effectif_salarie_entreprise
    ),
    etablissements: listOfEtablissement,
    estDiffusible: true,
    estActive: !!(siege && siege.estActif),
    estEntrepreneurIndividuel: isEntrepreneurIndividuelFromNatureJuridique(
      nature_juridique_entreprise
    ),
    estEss: false,
    nomComplet: nom_complet || 'Nom inconnu',
    chemin: nom_url,
    dateCreation: date_creation_entreprise,
    dateDebutActivite: date_debut_activite,
    dateDerniereMiseAJour: date_mise_a_jour,
    nombreEtablissements: nombre_etablissements,
    adresse: formatAdresse(
      numero_voie,
      indice_repetition,
      type_voie,
      libelle_voie,
      code_postal,
      libelle_commune
    ),
    currentEtablissementPage: page,
  };
};

export default getUniteLegaleSireneOuverte;
