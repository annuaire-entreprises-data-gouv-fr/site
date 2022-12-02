import { createDefaultUniteLegale, IUniteLegale } from '../../models';
import constants from '../../models/constants';
import { createEtablissementsList } from '../../models/etablissements-list';
import { isEntrepreneurIndividuelFromNatureJuridique } from '../../utils/helpers/checks';
import { Siren } from '../../utils/helpers/siren-and-siret';
import {
  libelleFromCategoriesJuridiques,
  libelleFromCodeEffectif,
  libelleFromCodeNAF,
  libelleFromeCodeCategorie,
} from '../../utils/labels';
import { httpGet } from '../../utils/network';
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
  categorie_entreprise: string;
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
  identifiantAssociationUniteLegale: string;
  economieSocialeSolidaireUniteLegale: string;
}
interface ISireneOuverteUniteLegaleResponse {
  unite_legale: ISireneOuverteUniteLegale[];
}

const clientUniteLegaleSireneOuverte = async (
  siren: Siren,
  page = 1
): Promise<IUniteLegale> => {
  const response = await httpGet(
    routes.sireneOuverte.uniteLegale + siren + '&page=' + page,
    { timeout: constants.timeout.L }
  );

  let uniteLegale;

  try {
    // Sirene ouverte does not return actual 404, just empty objects/arrays
    const result = response.data[0] as ISireneOuverteUniteLegaleResponse;

    if (!result.unite_legale) {
      throw new Error('No unite légale');
    }

    uniteLegale = result.unite_legale[0];

    if (!uniteLegale) {
      throw new Error('No unite légale');
    }
  } catch (e: any) {
    throw new HttpNotFound(siren);
  }

  return mapToDomainObject(siren, uniteLegale, page);
};

const mapToDomainObject = (
  siren: Siren,
  uniteLegale: ISireneOuverteUniteLegale,
  page: number
): IUniteLegale => {
  const siege = mapSireneOuverteEtablissementToDomainObject(
    uniteLegale.etablissement_siege[0],
    uniteLegale.etablissement_siege[0].siret
  );

  const listOfEtablissements = uniteLegale.etablissements.map((etab) =>
    mapSireneOuverteEtablissementToDomainObject(etab, etab.siret)
  );

  if (!listOfEtablissements || listOfEtablissements.length === 0) {
    throw new HttpServerError(`No etablissements found`);
  }

  const {
    date_creation_entreprise,
    date_mise_a_jour,
    date_debut_activite,
    nom_complet,
    nom_url,
    categorie_entreprise,
    nombre_etablissements,
    nature_juridique_entreprise,
    tranche_effectif_salarie_entreprise,
    identifiantAssociationUniteLegale,
    economieSocialeSolidaireUniteLegale,
    activite_principale_entreprise,
  } = uniteLegale;

  return {
    ...createDefaultUniteLegale(siren),
    siren,
    siege,
    activitePrincipale: activite_principale_entreprise,
    libelleActivitePrincipale: libelleFromCodeNAF(
      activite_principale_entreprise
    ),
    libelleCategorieEntreprise: libelleFromeCodeCategorie(categorie_entreprise),
    natureJuridique: nature_juridique_entreprise,
    libelleNatureJuridique: libelleFromCategoriesJuridiques(
      nature_juridique_entreprise
    ),
    trancheEffectif: tranche_effectif_salarie_entreprise,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      tranche_effectif_salarie_entreprise
    ),
    etablissements: createEtablissementsList(
      listOfEtablissements,
      page,
      nombre_etablissements
    ),
    estDiffusible: true,
    estActive: !!(siege && siege.estActif),
    nomComplet: nom_complet || 'Nom inconnu',
    chemin: nom_url,
    dateCreation: date_creation_entreprise,
    dateDebutActivite: date_debut_activite,
    dateDerniereMiseAJour: date_mise_a_jour,
    dirigeant: null,
    complements: {
      estEntrepreneurIndividuel: isEntrepreneurIndividuelFromNatureJuridique(
        nature_juridique_entreprise
      ),
      estEss: economieSocialeSolidaireUniteLegale === 'O',
    },
    association: {
      idAssociation: identifiantAssociationUniteLegale || null,
    },
  };
};

export default clientUniteLegaleSireneOuverte;
