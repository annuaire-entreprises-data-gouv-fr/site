import { verifySiret } from '../../utils/helpers/siren-and-siret';
import { inseeClientGet, INSEE_CREDENTIALS } from '.';
import constants from '../../constants';
import {
  createDefaultEtablissement,
  IEtablissement,
  IEtablissementsList,
} from '../../models';
import { extractSirenFromSiret } from '../../utils/helpers/siren-and-siret';
import {
  formatAdresse,
  libelleFromCodeEffectif,
  libelleFromCodeNaf,
} from '../../utils/labels';
import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
} from '../exceptions';
import routes from '../routes';
import {
  IInseeEtablissement,
  IInseeEtablissementResponse,
  IInseeEtablissementsResponse,
} from './types';

const getAllEtablissementsFactory =
  (credential: INSEE_CREDENTIALS) =>
  async (siren: string, page = 1): Promise<IEtablissementsList> => {
    const etablissementsPerPage = constants.resultsPerPage.etablissements;
    const cursor = Math.max(page - 1, 0) * etablissementsPerPage;

    const response = await inseeClientGet(
      routes.sireneInsee.siretBySiren +
        siren +
        `&nombre=${etablissementsPerPage}` +
        `&debut=${cursor}`,
      credential
    );

    const { header, etablissements } = response as IInseeEtablissementsResponse;

    return {
      currentEtablissementPage: page,
      etablissements: etablissements.map(mapEtablissementToDomainObject),
      nombreEtablissements: header.total,
    };
  };

const getEtablissementFactory =
  (credential: INSEE_CREDENTIALS) => async (siret: string) => {
    const response = await inseeClientGet(
      routes.sireneInsee.siret + siret,
      credential
    );

    const { etablissement, etablissements } =
      response as IInseeEtablissementResponse;

    if (!etablissement && etablissements) {
      throw new HttpServerError(
        500,
        'INSEE returns multiple siret for one etablissement'
      );
    }
    return mapEtablissementToDomainObject(etablissement);
  };

export const mapEtablissementToDomainObject = (
  inseeEtablissement: IInseeEtablissement
): IEtablissement => {
  // There cases of inseeEtablissement undefined.
  // For instance 89898637700015 that returns an etablissementS instead of etablissement and that also returns a different siren/siret
  // as sirene.fr doesnot disply it, we dont either

  if (!inseeEtablissement) {
    throw new HttpNotFound(404, 'Not Found');
  }

  const {
    nic,
    siret,
    etablissementSiege,
    trancheEffectifsEtablissement,
    anneeEffectifsEtablissement,
    dateCreationEtablissement,
    dateDernierTraitementEtablissement,
    adresseEtablissement,
    statutDiffusionEtablissement,
    periodesEtablissement,
  } = inseeEtablissement;

  let lastEtatAdministratif = periodesEtablissement.find(
    (periode) => periode.changementEtatAdministratifEtablissement === true
  );

  if (!lastEtatAdministratif) {
    lastEtatAdministratif = periodesEtablissement[0];
  }
  const estActif = lastEtatAdministratif.etatAdministratifEtablissement === 'A';
  const dateFermeture = !estActif ? lastEtatAdministratif.dateDebut : null;
  const activitePrincipaleEtablissement =
    lastEtatAdministratif.activitePrincipaleEtablissement;

  if (statutDiffusionEtablissement === 'N') {
    throw new HttpForbiddenError(403, 'Forbidden (non diffusible)');
  }

  const defaultEtablissement = createDefaultEtablissement();

  return {
    ...defaultEtablissement,
    siren: extractSirenFromSiret(siret),
    siret: verifySiret(siret),
    nic,
    dateCreation: dateCreationEtablissement,
    activitePrincipale: activitePrincipaleEtablissement,
    libelleActivitePrincipale: libelleFromCodeNaf(
      activitePrincipaleEtablissement
    ),
    dateDerniereMiseAJour: dateDernierTraitementEtablissement,
    estSiege: !!etablissementSiege,
    estActif,
    dateFermeture,
    trancheEffectif: trancheEffectifsEtablissement,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      trancheEffectifsEtablissement,
      anneeEffectifsEtablissement
    ),
    adresse: formatAdresse(
      adresseEtablissement.numeroVoieEtablissement,
      adresseEtablissement.indiceRepetitionEtablissement,
      adresseEtablissement.typeVoieEtablissement,
      adresseEtablissement.libelleVoieEtablissement,
      adresseEtablissement.codePostalEtablissement,
      adresseEtablissement.libelleCommuneEtablissement
    ),
  };
};

//=================
// public methods
//=================

export const getAllEtablissementsInsee = getAllEtablissementsFactory(
  INSEE_CREDENTIALS.DEFAULT
);

export const getAllEtablissementsInseeWithFallbackCredentials =
  getAllEtablissementsFactory(INSEE_CREDENTIALS.FALLBACK);

export const getEtablissementInsee = getEtablissementFactory(
  INSEE_CREDENTIALS.DEFAULT
);

export const getEtablissementInseeWithFallbackCredentials =
  getEtablissementFactory(INSEE_CREDENTIALS.FALLBACK);
