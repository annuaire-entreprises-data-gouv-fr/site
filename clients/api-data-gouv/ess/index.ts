import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { IESS } from '#models/certifications/ess';
import constants from '#models/constants';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';

export const clientEss = async (siren: Siren): Promise<IESS> => {
  const response = await httpGet<IESSDatagouvResponse>(
    `${routes.datagouv.ess}?SIREN__exact=${siren}`,
    {
      timeout: constants.timeout.L,
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
