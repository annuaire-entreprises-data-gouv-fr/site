import { inseeClientGet, InseeForbiddenError } from '.';
import { createDefaultEtablissement, IEtablissement } from '../../models';
import { extractSirenFromSiret } from '../../utils/helpers/siren-and-siret';
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
export const getAllEtablissementInsee = async (siren: string, page = 1) => {
  const request = await inseeClientGet(routes.sireneInsee.siretBySiren + siren);
  const {
    etablissements,
  } = (await request.json()) as IInseeEtablissementsResponse;

  return etablissements.map(mapToDomainObject);
};

export const getEtablissementInsee = async (siret: string) => {
  const response = await inseeClientGet(routes.sireneInsee.siret + siret);
  const {
    etablissement,
  } = (await response.json()) as IInseeEtablissementResponse;
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
    activitePrincipaleRegistreMetiersEtablissement,
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
    activitePrincipale: activitePrincipaleRegistreMetiersEtablissement,
    libelleActivitePrincipale: libelleFromCodeNaf(
      activitePrincipaleRegistreMetiersEtablissement
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
