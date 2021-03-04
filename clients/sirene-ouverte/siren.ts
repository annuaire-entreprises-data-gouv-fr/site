import { SireneEtalabServerError } from '.';
import { IUniteLegale } from '../../models';
import {
  formatAdresse,
  libelleFromCategoriesJuridiques,
  libelleFromCodeEffectif,
  libelleFromCodeNaf,
} from '../../utils/labels';
import routes from '../routes';
import {
  ISireneOuverteEtablissement,
  mapSireneOuverteEtablissementToDomainObject,
} from './siret';

/**
 * GET UNITE LEGALE
 */

interface ISireneOuverteUniteLegaleResponse {
  unite_legale: {
    etablissement_siege: ISireneOuverteEtablissement[];
    etablissements: ISireneOuverteEtablissement[];
    date_creation: string;
    date_creation_entreprise: string;
    date_mise_a_jour: string;
    numero_tva_intra: string;
    date_debut_activite: string;
    tranche_effectif_salarie_entreprise: string;
    nature_juridique_entreprise: string;
    nom_complet: string;
    nom_url: string;
    numero_voie: string;
    type_voie: string;
    libelle_commune: string;
    code_postal: string;
    libelle_voie: string;
    activite_principale_entreprise: string;
  }[];
}

const getUniteLegaleSireneOuverte = async (
  siren: string
): Promise<IUniteLegale> => {
  const response = await fetch(routes.sireneOuverte.uniteLegale + siren);

  if (response.status !== 200) {
    throw new SireneEtalabServerError(500, await response.text());
  }

  const result = (
    await response.json()
  )[0] as ISireneOuverteUniteLegaleResponse;

  return mapToDomainObject(siren, result);
};

const mapToDomainObject = (
  siren: string,
  result: ISireneOuverteUniteLegaleResponse
): IUniteLegale => {
  const uniteLegale = result.unite_legale[0];
  const siege = mapSireneOuverteEtablissementToDomainObject(
    uniteLegale.etablissement_siege[0]
  );

  const listOfEtablissement = uniteLegale.etablissements.map(
    mapSireneOuverteEtablissementToDomainObject
  );

  if (!listOfEtablissement || listOfEtablissement.length === 0) {
    throw new SireneEtalabServerError(500, `No etablissements found`);
  }

  const {
    date_creation_entreprise,
    date_mise_a_jour,
    numero_tva_intra,
    date_debut_activite,
    nom_complet,
    nom_url,
    numero_voie,
    type_voie,
    libelle_commune,
    code_postal,
    libelle_voie,
    nature_juridique_entreprise,
    tranche_effectif_salarie_entreprise,
    activite_principale_entreprise,
  } = uniteLegale;

  return {
    siren,
    numeroTva: numero_tva_intra,
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
    nomComplet: nom_complet,
    chemin: nom_url,
    dateCreation: date_creation_entreprise,
    dateDebutActivite: date_debut_activite,
    dateDerniereMiseAJour: date_mise_a_jour,
    adresse: formatAdresse(
      numero_voie,
      type_voie,
      libelle_commune,
      code_postal,
      libelle_voie
    ),
  };
};

export default getUniteLegaleSireneOuverte;
