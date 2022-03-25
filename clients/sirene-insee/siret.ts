import { Siren, Siret } from '../../utils/helpers/siren-and-siret';
import { inseeClientGet, INSEE_CREDENTIALS } from '.';
import constants from '../../models/constants';
import {
  createDefaultEtablissement,
  IEtablissement,
  IEtablissementsList,
} from '../../models';
import { extractSirenFromSiret } from '../../utils/helpers/siren-and-siret';
import {
  libelleFromCodeEffectif,
  libelleFromCodeNaf,
} from '../../utils/labels';
import { HttpNotFound, HttpServerError } from '../exceptions';
import routes from '../routes';
import {
  capitalize,
  formatAdresse,
  formatEnseigne,
} from '../../utils/helpers/formatting';

interface IInseeEtablissementResponse {
  etablissement: IInseeEtablissement;
  etablissements: IInseeEtablissement[];
}
interface IInseeEtablissementsResponse {
  header: { total: number; debut: number; nombre: number };
  etablissements: IInseeEtablissement[];
}

interface IInseeEtablissement {
  siret: Siret;
  nic: string;
  etablissementSiege: string;
  statutDiffusionEtablissement: string;
  trancheEffectifsEtablissement: string;
  anneeEffectifsEtablissement: string;
  dateCreationEtablissement: string;
  dateDernierTraitementEtablissement: string;
  activitePrincipaleRegistreMetiersEtablissement: string;
  periodesEtablissement: {
    dateFin: string;
    dateDebut: string;
    enseigne1Etablissement: string;
    enseigne2Etablissement: string;
    enseigne3Etablissement: string;
    denominationUsuelleEtablissement: string;
    etatAdministratifEtablissement: string;
    changementEtatAdministratifEtablissement: boolean;
    activitePrincipaleEtablissement: string;
  }[];
  adresseEtablissement: {
    complementAdresseEtablissement: string;
    numeroVoieEtablissement: string;
    indiceRepetitionEtablissement: string;
    typeVoieEtablissement: string;
    libelleVoieEtablissement: string;
    codePostalEtablissement: string;
    libelleCommuneEtablissement: string;
    libellePaysEtrangerEtablissement?: string;
  };
  uniteLegale: IInseeetablissementUniteLegale;
}

interface IInseeetablissementUniteLegale {
  sigleUniteLegale: string;
  dateCreationUniteLegale: string;
  periodesUniteLegale: string;
  dateDernierTraitementUniteLegale: string;
  trancheEffectifsUniteLegale: string;
  anneeEffectifsUniteLegale: string;
  statutDiffusionUniteLegale: string;
  prenom1UniteLegale: string;
  sexeUniteLegale: string;
  identifiantAssociationUniteLegale: string;
  nicSiegeUniteLegale: string;
  dateDebut: string;
  activitePrincipaleUniteLegale: string;
  categorieJuridiqueUniteLegale: string;
  denominationUniteLegale: string;
  economieSocialeSolidaireUniteLegale: string;
  etatAdministratifUniteLegale: string;
  nomUniteLegale: string;
}

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
      etablissements: etablissements.map((e) =>
        mapEtablissementToDomainObject(e)
      ),
      nombreEtablissements: header.total,
    };
  };

const getEtablissementFactory =
  (credential: INSEE_CREDENTIALS) => async (siret: Siret) => {
    const response = await inseeClientGet(
      routes.sireneInsee.siret + siret,
      credential
    );

    const { etablissement, etablissements } =
      response as IInseeEtablissementResponse;

    if (!etablissement && etablissements) {
      if (etablissements.length === 1) {
        return mapEtablissementToDomainObject(etablissements[0], siret);
      }

      throw new HttpServerError(
        500,
        'INSEE returns multiple siret for one etablissement'
      );
    }
    return mapEtablissementToDomainObject(etablissement, siret);
  };

const getSiegeFactory =
  (credential: INSEE_CREDENTIALS) =>
  async (siren: Siren): Promise<IEtablissement> => {
    const response = (await inseeClientGet(
      routes.sireneInsee.siege + siren,
      credential
    )) as IInseeEtablissementResponse;

    return mapEtablissementToDomainObject(response.etablissements[0]);
  };

export const mapEtablissementToDomainObject = (
  inseeEtablissement: IInseeEtablissement,
  oldSiret?: Siret
): IEtablissement => {
  // There cases of inseeEtablissement undefined.
  // For instance 89898637700015 that returns an etablissementS instead of etablissement and that also returns a different siren/siret
  // as sirene.fr doesnot display it, we dont either

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
  const {
    activitePrincipaleEtablissement,
    denominationUsuelleEtablissement,
    enseigne1Etablissement,
    enseigne2Etablissement,
    enseigne3Etablissement,
  } = lastEtatAdministratif;

  const enseigne = capitalize(
    formatEnseigne(
      enseigne1Etablissement,
      enseigne2Etablissement,
      enseigne3Etablissement
    ) || ''
  );

  const defaultEtablissement = createDefaultEtablissement();

  return {
    ...defaultEtablissement,
    siren: extractSirenFromSiret(siret),
    siret,
    oldSiret: oldSiret || siret,
    nic,
    enseigne,
    denomination: capitalize(denominationUsuelleEtablissement || ''),
    dateCreation: dateCreationEtablissement,
    activitePrincipale: activitePrincipaleEtablissement,
    libelleActivitePrincipale: libelleFromCodeNaf(
      activitePrincipaleEtablissement
    ),
    dateDerniereMiseAJour: dateDernierTraitementEtablissement,
    estSiege: !!etablissementSiege,
    estActif,
    estDiffusible: statutDiffusionEtablissement !== 'N',
    dateFermeture,
    trancheEffectif: trancheEffectifsEtablissement,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      trancheEffectifsEtablissement,
      anneeEffectifsEtablissement
    ),
    adresse: formatAdresse(
      adresseEtablissement.complementAdresseEtablissement,
      adresseEtablissement.numeroVoieEtablissement,
      adresseEtablissement.indiceRepetitionEtablissement,
      adresseEtablissement.typeVoieEtablissement,
      adresseEtablissement.libelleVoieEtablissement,
      adresseEtablissement.codePostalEtablissement,
      adresseEtablissement.libelleCommuneEtablissement,
      adresseEtablissement.libellePaysEtrangerEtablissement
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

export const getSiegeInsee = getSiegeFactory(INSEE_CREDENTIALS.DEFAULT);

export const getSiegeInseeWithFallbackCredentials = getSiegeFactory(
  INSEE_CREDENTIALS.FALLBACK
);
