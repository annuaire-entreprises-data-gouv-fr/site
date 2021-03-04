import { inseeClient } from '.';
import { IEtablissement, IUniteLegale } from '../../models';
import {
  libelleFromCategoriesJuridiques,
  libelleFromCodeNaf,
} from '../../utils/labels';
import routes from '../routes';

interface IInseeUniteLegaleResponse {
  uniteLegale: {
    sigleUniteLegale: string;
    dateCreationUniteLegale: string;
    periodesUniteLegale: IPeriodeUniteLegale[];
    dateDernierTraitementUniteLegale: string;
    trancheEffectifsUniteLegale: string;
    statutDiffusionUniteLegale: string;
  };
}
interface IPeriodeUniteLegale {
  nicSiegeUniteLegale: string;
  etatAdministratifUniteLegale: string;
  dateDebut: string;
  activitePrincipaleUniteLegale: string;
  categorieJuridiqueUniteLegale: string;
  denominationUniteLegale: string;
}

export const CreateNonDiffusibleUniteLegale = (
  siren: string
): IUniteLegale => ({
  siren,
  siege: {
    siren,
    estActif: null,
    estSiege: true,
  },
  isDiffusible: false,
  fullName: 'Cette entreprise n’est pas diffusible',
  path: siren,
});

export const getUniteLegaleInsee = async (siren: string) => {
  const request = await inseeClient(routes.sireneInsee.siren + siren);
  const response = (await request.json()) as IInseeUniteLegaleResponse;
  return mapToDomainObject(siren, response);
};

const mapToDomainObject = (
  siren: string,
  response: IInseeUniteLegaleResponse
): IUniteLegale => {
  const {
    sigleUniteLegale,
    dateCreationUniteLegale,
    periodesUniteLegale,
    dateDernierTraitementUniteLegale,
    trancheEffectifsUniteLegale,
    statutDiffusionUniteLegale,
  } = response.uniteLegale;

  const {
    nicSiegeUniteLegale,
    etatAdministratifUniteLegale,
    dateDebut,
    activitePrincipaleUniteLegale,
    categorieJuridiqueUniteLegale,
    denominationUniteLegale,
  } = periodesUniteLegale[0];

  let siege: IEtablissement;

  if (periodesUniteLegale && periodesUniteLegale.length > 0) {
    siege = {
      siren: siren,
      siret: siren + nicSiegeUniteLegale,
      nic: nicSiegeUniteLegale,
      estActif: etatAdministratifUniteLegale === 'A',
      dateCreation: dateDebut,
      activitePrincipale: activitePrincipaleUniteLegale,
      libelleActivitePrincipale: libelleFromCodeNaf(
        activitePrincipaleUniteLegale
      ),
      estSiege: true,
      trancheEffectif: null,
    };
  }

  return {
    siren: siren,
    siege: siege,
    numeroTva: null,
    dateDebutActivite: null,
    natureJuridique: categorieJuridiqueUniteLegale,
    libelleNatureJuridique: libelleFromCategoriesJuridiques(
      categorieJuridiqueUniteLegale
    ),
    etablissements: siege ? [siege] : [],
    dateCreation: dateCreationUniteLegale,
    dateDerniereMiseAJour: (dateDernierTraitementUniteLegale || '').split(
      'T'
    )[0],
    estDiffusible: statutDiffusionUniteLegale !== 'N',
    nomComplet: `${(
      denominationUniteLegale || ''
    ).toLowerCase()} (${sigleUniteLegale})`,
    chemin: siren,
    trancheEffectif: trancheEffectifsUniteLegale,
  };
};
