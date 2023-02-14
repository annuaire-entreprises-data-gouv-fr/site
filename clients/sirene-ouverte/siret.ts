import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { etatFromEtatAdministratifInsee } from '#clients/sirene-insee/helpers';
import { estActif } from '#models/etat-administratif';
import { createDefaultEtablissement, IEtablissement } from '#models/index';
import { ISTATUTDIFFUSION } from '#models/statut-diffusion';
import {
  extractNicFromSiret,
  extractSirenFromSiret,
  formatAdresse,
} from '#utils/helpers';
import { libelleFromCodeEffectif, libelleFromCodeNAF } from '#utils/labels';
import { httpGet } from '#utils/network';

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

const clientEtablissementSireneOuverte = async (
  siret: string
): Promise<IEtablissement> => {
  const route = `${routes.sireneOuverte.etablissement}${encodeURI(siret)}`;
  const response = await httpGet(route);

  let etablissement;

  try {
    // Sirene ouverte does not return actual 404, just empty objects/arrays
    const result = response.data[0] as ISireneOuverteEtablissementResponse;

    if (!result.etablissement) {
      throw new Error('No etablissement');
    }

    etablissement = result.etablissement[0];
    if (!etablissement) {
      throw new Error('No etablissement');
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
  const { etat_administratif_etablissement, date_debut_activite } =
    etablissement;
  const statutDiffusion = ISTATUTDIFFUSION.DIFFUSIBLE;
  const etatAdministratif = etatFromEtatAdministratifInsee(
    etat_administratif_etablissement || '',
    siret
  );

  const dateFermeture = !estActif({ etatAdministratif })
    ? date_debut_activite
    : null;

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
    estSiege: etablissement.is_siege,
    statutDiffusion,
    etatAdministratif,
    dateCreation: etablissement.date_creation,
    dateDerniereMiseAJour: etablissement.date_mise_a_jour,
    dateDebutActivite: etablissement.date_debut_activite,
    dateFermeture,
    adresse: formatAdresse({
      numeroVoie: numero_voie,
      indiceRepetition: indice_repetition,
      typeVoie: type_voie,
      libelleVoie: libelle_voie,
      codePostal: code_postal,
      libelleCommune: libelle_commune,
    }),
    codePostal: code_postal,
    commune: libelle_commune,
    activitePrincipale: etablissement.activite_principale,
    libelleActivitePrincipale: libelleFromCodeNAF(
      etablissement.activite_principale
    ),
    trancheEffectif: etablissement.tranche_effectif_salarie,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      etablissement.tranche_effectif_salarie
    ),
  };
};

export { clientEtablissementSireneOuverte };
