import { HttpNotFound } from "#clients/exceptions";
import routes from "#clients/routes";
import constants from "#models/constants";
import type { Siren } from "#utils/helpers";
import { httpGet } from "#utils/network";

export const clientDPO = async (siren: Siren): Promise<IDPO> => {
  const response = await httpGet<IDPODatagouvResponse>(
    `${routes.datagouv.dpo}?SIREN%20organisme%20désignant__exact=${siren}`,
    {
      timeout: constants.timeout.L,
    }
  );

  if (response.data.length === 0) {
    throw new HttpNotFound(`No DPO record found for siren ${siren}`);
  }

  return mapToDomainObject(response.data[0]);
};

const mapToDomainObject = (response: IDPOItem) => ({
  typeDPO: response["Type de DPO"],
  organismeDesigne: {
    siren: response["SIREN organisme désigné"],
    nom: response["Nom organisme désigné"],
    secteurActivite: response["Secteur activité organisme désigné"],
    codeNAF: response["Code NAF organisme désigné"],
    adressePostale: response["Adresse postale organisme désigné"],
    codePostal: response["Code postal organisme désigné"],
    ville: response["Ville organisme désigné"],
    pays: response["Pays organisme désigné"],
  },
  contact: {
    email: response["Moyen contact DPO email"],
    url: response["Moyen contact DPO url"],
    telephone: response["Moyen contact DPO téléphone"],
    adressePostale: response["Moyen contact DPO adresse postale"],
    codePostal: response["Moyen contact DPO code postal"],
    ville: response["Moyen contact DPO ville"],
    pays: response["Moyen contact DPO pays"],
    autre: response["Moyen contact DPO autre"],
  },
});
