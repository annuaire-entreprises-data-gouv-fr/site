import { inseeClientGet } from '.';
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
  adresseEtablissement: {
    numeroVoieEtablissement: string;
    indiceRepetitionEtablissement: string;
    typeVoieEtablissement: string;
    libelleVoieEtablissement: string;
    codePostalEtablissement: string;
    libelleCommuneEtablissement: string;
  };
}
export const getAllEtablissementInsee = async (siren: string) => {
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
  } = inseeEtablissement;

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
    trancheEffectif: trancheEffectifsEtablissement,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      trancheEffectifsEtablissement
    ),
    adresse: formatAdresse(
      `${adresseEtablissement.numeroVoieEtablissement || ''}${
        adresseEtablissement.indiceRepetitionEtablissement || ''
      }`,
      adresseEtablissement.typeVoieEtablissement,
      adresseEtablissement.libelleCommuneEtablissement,
      adresseEtablissement.codePostalEtablissement,
      adresseEtablissement.libelleVoieEtablissement
    ),
  };
};
