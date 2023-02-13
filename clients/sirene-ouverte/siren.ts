import { HttpNotFound, HttpServerError } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { createEtablissementsList } from '#models/etablissements-list';
import { estActif, IETATADMINSTRATIF } from '#models/etat-administratif';
import { createDefaultUniteLegale, IUniteLegale } from '#models/index';
import { ISTATUTDIFFUSION } from '#models/statut-diffusion';
import {
  isEntrepreneurIndividuelFromNatureJuridique,
  Siren,
} from '#utils/helpers';
import {
  libelleFromCategoriesJuridiques,
  libelleFromCodeEffectif,
  libelleFromCodeNAF,
  libelleFromeCodeCategorie,
} from '#utils/labels';
import { httpGet } from '#utils/network';
import {
  ISireneOuverteEtablissement,
  mapSireneOuverteEtablissementToDomainObject,
} from './siret';

/**
 * GET UNITE LEGALE
 */
interface ISireneOuverteUniteLegale {
  etablissement_siege: ISireneOuverteEtablissement[]; //Siege
  etablissements: ISireneOuverteEtablissement[]; //matching_etablissements
  date_creation: string; //RESULT => date_creation
  date_creation_entreprise: string; //unknow
  date_mise_a_jour: string; //date_mise_a_jour
  numero_tva_intra: string; //TO_BE_GENERATE
  date_debut_activite: string; //RESULT => date_debut_activite
  tranche_effectif_salarie_entreprise: string; //SIEGE => tranche_effectif_salarie
  categorie_entreprise: string; // RESULT => categorie_entreprise
  nature_juridique_entreprise: string; // RESULT => nature_juridique_entreprise
  nombre_etablissements: number; // RESULT => nombre_etablissements
  nom_complet: string; // RESULT => nom_complet
  nom_url: string; //Unknow
  numero_voie: string; //SIEGE => numero_voie
  indice_repetition: string; //SIEGE => indice_repetition
  type_voie: string; // RESULT => type_voie
  libelle_commune: string; //SIEGE => libelle_commune
  code_postal: string; //SIEGE => code_postal
  libelle_voie: string; //SIEGE => libelle_voie
  activite_principale_entreprise: string; //SIEGE => activite_principale
  identifiantAssociationUniteLegale: string; //Complements => identifiant_association
  economieSocialeSolidaireUniteLegale: string; //Unknow
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

  const defaultUniteLegale = createDefaultUniteLegale(siren);
  return {
    ...defaultUniteLegale,
    siren,
    siege,
    activitePrincipale: activite_principale_entreprise,
    libelleActivitePrincipale: libelleFromCodeNAF(
      activite_principale_entreprise
    ),
    libelleCategorieEntreprise: libelleFromeCodeCategorie(categorie_entreprise),
    natureJuridique: nature_juridique_entreprise || '',
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
    statutDiffusion: ISTATUTDIFFUSION.DIFFUSIBLE,
    etatAdministratif:
      siege && estActif(siege)
        ? IETATADMINSTRATIF.ACTIF
        : IETATADMINSTRATIF.CESSEE,
    nomComplet: nom_complet || 'Nom inconnu',
    chemin: nom_url,
    dateCreation: date_creation_entreprise,
    dateDebutActivite: date_debut_activite,
    dateDerniereMiseAJour: date_mise_a_jour,
    dirigeant: null,
    complements: {
      ...defaultUniteLegale.complements,
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
