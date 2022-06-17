import { createDefaultEtablissement, IEtablissement } from '../../models';
import { formatAdresse } from '../../utils/helpers/formatting';
import {
  extractNicFromSiret,
  extractSirenFromSiret,
} from '../../utils/helpers/siren-and-siret';
import {
  libelleFromCodeEffectif,
  libelleFromCodeNaf,
} from '../../utils/labels';
import { httpGet } from '../../utils/network';
import { HttpNotFound } from '../exceptions';
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
  indice_repetition: string;
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
  const response = await httpGet(route);

  let etablissement;

  try {
    // Sirene ouverte does not return actual 404, just empty objects/arrays
    const result = response.data[0] as ISireneOuverteEtablissementResponse;

    if (!result.etablissement) {
      throw new Error();
    }

    etablissement = result.etablissement[0];
    if (!etablissement) {
      throw new Error();
    }
  } catch (e: any) {
    throw new HttpNotFound('Not Found');
  }

  return mapSireneOuverteEtablissementToDomainObject(etablissement, siret);
};

export const mapSireneOuverteEtablissementToDomainObject = (
  etablissement: ISireneOuverteEtablissement,
  siret: string
): IEtablissement => {
  const estActif = etablissement.etat_administratif_etablissement === 'A';

  const {
    numero_voie,
    indice_repetition,
    type_voie,
    libelle_voie,
    code_postal,
    libelle_commune,
  } = etablissement;

  return {
    ...createDefaultEtablissement(),
    enseigne: etablissement.enseigne || null,
    //@ts-ignore
    siren: extractSirenFromSiret(siret),
    //@ts-ignore
    siret,
    nic: extractNicFromSiret(siret),
    estActif,
    estSiege: etablissement.is_siege,
    estDiffusible: true,
    dateCreation: etablissement.date_creation,
    dateDerniereMiseAJour: etablissement.date_mise_a_jour,
    dateDebutActivite: etablissement.date_debut_activite,
    dateFermeture: !estActif ? etablissement.date_debut_activite : null,
    adresse: formatAdresse({
      numeroVoie: numero_voie,
      indiceRepetition: indice_repetition,
      typeVoie: type_voie,
      libelleVoie: libelle_voie,
      codePostal: code_postal,
      libelleCommune: libelle_commune,
    }),
    activitePrincipale: etablissement.activite_principale,
    libelleActivitePrincipale: libelleFromCodeNaf(
      etablissement.activite_principale
    ),
    trancheEffectif: etablissement.tranche_effectif_salarie,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      etablissement.tranche_effectif_salarie
    ),
  };
};

export { getEtablissementSireneOuverte };
