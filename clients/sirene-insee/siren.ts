import { inseeClient } from '.';
import { IEtablissement, IUniteLegale } from '../../models';
import { libelleFromCodeNaf } from '../../utils/labels';
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
      isActive: etatAdministratifUniteLegale === 'A',
      creationDate: dateDebut,
      mainActivity: activitePrincipaleUniteLegale,
      mainActivityLabel: libelleFromCodeNaf(activitePrincipaleUniteLegale),
      isSiege: true,
      headcount: null,
    };
  }

  return {
    siren: siren,
    siege: siege,
    companyLegalStatus: categorieJuridiqueUniteLegale,
    etablissementList: siege ? [siege] : [],
    creationDate: dateCreationUniteLegale,
    lastUpdateDate: (dateDernierTraitementUniteLegale || '').split('T')[0],
    isDiffusible: statutDiffusionUniteLegale !== 'N',
    fullName: `${(
      denominationUniteLegale || ''
    ).toLowerCase()} (${sigleUniteLegale})`,
    path: siren,
    headcount: trancheEffectifsUniteLegale,
  };
};
