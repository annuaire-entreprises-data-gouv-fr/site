import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { IESS } from '#models/certifications/ess';
import constants from '#models/constants';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';

type IESSItem = {
  SIREN: string; //'923114524';
  "Nom ou raison sociale de l'entreprise": string; //"MAM P'TITE ETOILE";
  "Famille juridique de l'entreprise": string; //'Associations';
  'Code postal': string; //'35390';
  "Libellé de la commune de l'établissement": string; //'GRAND-FOUGERAY';
  "Code du département de l'établissement": string; //'35';
  "Département de l'établissement": string; //'ILLE ET VILAINE';
  "Région de l'établissement": string; //'BRETAGNE';
};
type IESSDatagouvResponse = {
  data: IESSItem[];
  meta: {
    page: number; //1;
    page_size: number; //20
    total: number; //1
  };
};

export const clientEss = async (siren: Siren): Promise<IESS> => {
  const response = await httpGet<IESSDatagouvResponse>(
    `${routes.datagouv.ess}?SIREN__exact=${siren}`,
    {
      timeout: constants.timeout.S,
    }
  );

  if (response.data.length === 0) {
    throw new HttpNotFound(`No ESS record found for siren ${siren}`);
  }

  return mapToDomainObject(response.data[0]);
};

const mapToDomainObject = (response: IESSItem) => {
  return {
    familleJuridique: response["Famille juridique de l'entreprise"],
    nom: response["Nom ou raison sociale de l'entreprise"],
    region: response["Région de l'établissement"],
  };
};
