import { inseeClient } from '.';
import { createDefaultEtablissement, IEtablissement } from '../../models';
import { extractSirenFromSiret } from '../../utils/helpers/siren-and-siret';
import {
  libelleFromCodeEffectif,
  libelleFromCodeNaf,
} from '../../utils/labels';
import routes from '../routes';

interface IInseeEtablissementResponse {
  etablissement: {
    siret: string;
    nic: string;
    etablissementSiege: string;
    statutDiffusionEtablissement: string;
    trancheEffectifsEtablissement: string;
    dateCreationEtablissement: string;
    dateDernierTraitementEtablissement: string;
    activitePrincipaleRegistreMetiersEtablissement: string;
  };
}

export const getEtablissementInsee = async (siret: string) => {
  const response = await inseeClient(routes.sireneInsee.siret + siret);
  const etablissement = (await response.json()) as IInseeEtablissementResponse;
  return mapToDomainObject(etablissement);
};

const mapToDomainObject = (
  response: IInseeEtablissementResponse
): IEtablissement => {
  const {
    siret,
    nic,
    etablissementSiege,
    trancheEffectifsEtablissement,
    dateCreationEtablissement,
    dateDernierTraitementEtablissement,
    activitePrincipaleRegistreMetiersEtablissement,
  } = response.etablissement;

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
  };
};
