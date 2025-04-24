import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { Siret } from '#utils/helpers';
import { httpGet } from '#utils/network';

export const clientAlimConfiance = async (
  siret: Siret
): Promise<IAlimConfiance> => {
  const response = await httpGet<IAlimConfianceDatagouvResponse>(
    `${routes.datagouv.alimConfiance}?SIRET__exact=${siret}`,
    {
      timeout: constants.timeout.S,
    }
  );

  if (response.data.length === 0) {
    throw new HttpNotFound(`No Alim Confiance record found for siret ${siret}`);
  }

  return mapToDomainObject(response.data[0]);
};

const mapToDomainObject = (response: IAlimConfianceItem) => {
  return {
    syntheseEvaluation: response['Synthese_eval_sanit'],
    dateInspection: response['Date_inspection'],
    libelleActiviteEtablissement:
      response['APP_Libelle_activite_etablissement'],
  };
};
