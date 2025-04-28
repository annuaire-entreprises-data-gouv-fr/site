import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';

export const clientAlimConfiance = async (
  siren: Siren
): Promise<IAlimConfiance[]> => {
  const response = await httpGet<IAlimConfianceDatagouvResponse>(
    `${routes.datagouv.alimConfiance}?SIRET__greater=${siren}00000&SIRET__less=${siren}99999`,
    {
      timeout: constants.timeout.S,
    }
  );

  if (response.data.length === 0) {
    throw new HttpNotFound(`No Alim Confiance record found for siren ${siren}`);
  }

  return mapToDomainObject(response.data);
};

const mapToDomainObject = (response: IAlimConfianceItem[]) => {
  return response.map((item) => ({
    syntheseEvaluation: item['Synthese_eval_sanit'],
    dateInspection: item['Date_inspection'],
    libelleActiviteEtablissement: item['APP_Libelle_activite_etablissement'],
    siret: item['SIRET'],
    denomination: item['APP_Libelle_etablissement'],
    adresse: item['Adresse_2_UA'],
    codePostal: item['com_code'],
    commune: item['com_name'],
    code: item['APP_Code_synthese_eval_sanit'],
  }));
};
