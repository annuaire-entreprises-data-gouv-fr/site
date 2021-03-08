import { SireneEtalabNotFound, SireneEtalabServerError } from '.';
import { IEtablissement } from '../../models';
import {
  formatAdresse,
  libelleFromCodeEffectif,
  libelleFromCodeNaf,
} from '../../utils/labels';
import routes from '../routes';

interface ISireneOuverteEtablissementResponse {
  etablissement: ISireneOuverteEtablissement[];
}
export interface ISireneOuverteEtablissement {
  enseigne?: string;
  siren: string;
  siret: string;
  nic: string;
  etat_administratif_etablissement: 'A' | null;
  date_creation: string;
  geo_adresse: string;
  etablissement_siege: string;
  activite_principale: string;
  date_mise_a_jour: string;
  date_debut_activite: string;
  libelle_activite_principale: string;
  is_siege: boolean;
  tranche_effectif_salarie: string;
  latitude: string;
  longitude: string;
  numero_voie: string;
  type_voie: string;
  libelle_commune: string;
  code_postal: string;
  libelle_voie: string;
}

/**
 * GET ETABLISSEMENT
 */

const getEtablissementSireneOuverte = async (
  siret: string
): Promise<IEtablissement> => {
  const route = `${routes.sireneOuverte.etablissement}${encodeURI(siret)}`;
  const response = await fetch(route);

  if (response.status !== 200) {
    throw new SireneEtalabServerError(500, await response.text());
  }

  const result = (
    await response.json()
  )[0] as ISireneOuverteEtablissementResponse;

  const etablissement = result.etablissement[0];

  if (!etablissement) {
    throw new SireneEtalabNotFound(404, siret);
  }

  return mapSireneOuverteEtablissementToDomainObject(etablissement);
};

export const mapSireneOuverteEtablissementToDomainObject = (
  etablissement: ISireneOuverteEtablissement
): IEtablissement => {
  return {
    enseigne: etablissement.enseigne,
    siren: etablissement.siren,
    siret: etablissement.siret,
    nic: etablissement.nic,
    estActif: etablissement.etat_administratif_etablissement === 'A',
    estSiege: etablissement.is_siege,
    dateCreation: etablissement.date_creation,
    dateDerniereMiseAJour: etablissement.date_mise_a_jour,
    dateDebutActivite: etablissement.date_debut_activite,
    adresse: formatAdresse(
      etablissement.numero_voie,
      etablissement.type_voie,
      etablissement.libelle_commune,
      etablissement.code_postal,
      etablissement.libelle_voie
    ),
    activitePrincipale: etablissement.activite_principale,
    libelleActivitePrincipale: libelleFromCodeNaf(
      etablissement.activite_principale
    ),
    trancheEffectif: etablissement.tranche_effectif_salarie,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      etablissement.tranche_effectif_salarie
    ),
    latitude: etablissement.latitude,
    longitude: etablissement.longitude,
  };
};

export { getEtablissementSireneOuverte };
