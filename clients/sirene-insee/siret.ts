import { inseeClientGet, InseeForbiddenError, INSEE_CREDENTIALS } from '.';
import constants from '../../constants';
import {
  createDefaultEtablissement,
  IEtablissement,
  IEtablissementsList,
} from '../../models';
import {
  extractSirenFromSiret,
  Siren,
} from '../../utils/helpers/siren-and-siret';
import {
  formatAdresse,
  libelleFromCodeEffectif,
  libelleFromCodeNaf,
} from '../../utils/labels';
import routes from '../routes';

interface IInseeEtablissementResponse {
  etablissement: IInseeEtablissement;
}
interface IInseeEtablissementsResponse {
  header: { total: number; debut: number; nombre: number };
  etablissements: IInseeEtablissement[];
}

interface IInseeEtablissement {
  siret: string;
  nic: string;
  etablissementSiege: string;
  statutDiffusionEtablissement: string;
  trancheEffectifsEtablissement: string;
  dateCreationEtablissement: string;
  dateDernierTraitementEtablissement: string;
  activitePrincipaleRegistreMetiersEtablissement: string;
  periodesEtablissement: {
    dateFin: string;
    dateDebut: string;
    etatAdministratifEtablissement: string;
    changementEtatAdministratifEtablissement: boolean;
    activitePrincipaleEtablissement: string;
  }[];
  adresseEtablissement: {
    numeroVoieEtablissement: string;
    indiceRepetitionEtablissement: string;
    typeVoieEtablissement: string;
    libelleVoieEtablissement: string;
    codePostalEtablissement: string;
    libelleCommuneEtablissement: string;
  };
}

const getAllEtablissementsCurry =
  (credential: INSEE_CREDENTIALS) =>
  async (siren: string, page = 1): Promise<IEtablissementsList> => {
    const etablissementsPerPage = constants.resultsPerPage.etablissements;
    const cursor = Math.max(page - 1, 0) * etablissementsPerPage;

    const request = await inseeClientGet(
      routes.sireneInsee.siretBySiren +
        siren +
        `&nombre=${etablissementsPerPage}` +
        `&debut=${cursor}`,
      credential
    );

    const { header, etablissements } =
      (await request.json()) as IInseeEtablissementsResponse;

    return {
      currentEtablissementPage: page,
      etablissements: etablissements.map(mapToDomainObject),
      nombreEtablissements: header.total,
    };
  };

const getEtablissementCurry =
  (credential: INSEE_CREDENTIALS) => async (siret: string) => {
    const response = await inseeClientGet(
      routes.sireneInsee.siret + siret,
      credential
    );
    const { etablissement } =
      (await response.json()) as IInseeEtablissementResponse;

    return mapToDomainObject(etablissement);
  };

const mapToDomainObject = (
  inseeEtablissement: IInseeEtablissement
): IEtablissement => {
  const {
    siret,
    nic,
    etablissementSiege,
    trancheEffectifsEtablissement,
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
    throw new InseeForbiddenError(403, 'Forbidden (non diffusible)');
  }

  const defaultEtablissement = createDefaultEtablissement();

  return {
    ...defaultEtablissement,
    siren: extractSirenFromSiret(siret),
    siret,
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
      trancheEffectifsEtablissement
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

export const getAllEtablissementsInsee = getAllEtablissementsCurry(
  INSEE_CREDENTIALS.DEFAULT
);

export const getAllEtablissementsInseeWithFallbackCredentials =
  getAllEtablissementsCurry(INSEE_CREDENTIALS.FALLBACK);

export const getEtablissementInsee = getEtablissementCurry(
  INSEE_CREDENTIALS.DEFAULT
);

export const getEtablissementInseeWithFallbackCredentials =
  getEtablissementCurry(INSEE_CREDENTIALS.FALLBACK);
