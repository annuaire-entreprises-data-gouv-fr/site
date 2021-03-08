import { inseeClient } from '.';
import { IEtablissement } from '../../models';
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

export const CreateNonDiffusibleEtablissement = (
  siret: string,
  isSiege = false
): IEtablissement => ({
  siret,
  estSiege: isSiege,
});

const mapToDomainObject = (
  response: IInseeEtablissementResponse
): IEtablissement => {
  const {
    siret,
    nic,
    etablissementSiege,
    statutDiffusionEtablissement,
    trancheEffectifsEtablissement,
    dateCreationEtablissement,
    dateDernierTraitementEtablissement,
    activitePrincipaleRegistreMetiersEtablissement,
  } = response.etablissement;

  return {
    enseigne: null,
    siren,
    siret,
    nic,
    date_creation: dateCreationEtablissement,
    geo_adresse: null,
    etablissement_siege: activitePrincipaleRegistreMetiersEtablissement,
    activite_principale: activitePrincipaleRegistreMetiersEtablissement,
    date_mise_a_jour: dateDernierTraitementEtablissement,
    date_debut_activite: null,
    libelle_activite_principale: activitePrincipaleRegistreMetiersEtablissement,
    is_siege: etablissementSiege ? '1' : null,
    tranche_effectif_salarie: trancheEffectifsEtablissement,
    latitude: null,
    longitude: null,
    statut_diffusion: statutDiffusionEtablissement,
  };
};
