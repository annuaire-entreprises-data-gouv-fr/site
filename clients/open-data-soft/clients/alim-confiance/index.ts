import { HttpNotFound } from "#clients/exceptions";
import odsClient from "#clients/open-data-soft";
import routes from "#clients/routes";
import type { Siren } from "#utils/helpers";

const PAGE_SIZE = 20;

export const clientAlimConfiance = async (
  siren: Siren,
  page = 1
): Promise<IAlimConfiance> => {
  const response = await odsClient(
    {
      url: routes.dgal.alimConfiance.search,
      config: {
        params: {
          where: `startsWith(siret,"${siren}")`,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        },
      },
    },
    routes.dgal.alimConfiance.metadata,
    { page, pageSize: PAGE_SIZE }
  );

  if (response.records.length === 0) {
    throw new HttpNotFound(`No Alim Confiance record found for siren ${siren}`);
  }

  return mapToDomainObject(response);
};

const mapToDomainObject = (
  response: IAlimConfianceODSResponse
): IAlimConfiance => ({
  data: response.records.map((item) => ({
    syntheseEvaluation: item.synthese_eval_sanit,
    dateInspection: item.date_inspection,
    libelleActiviteEtablissement:
      item.app_libelle_activite_etablissement.join(", "),
    siret: item.siret,
    denomination: item.app_libelle_etablissement,
    adresse: item.adresse_2_ua,
    codePostal: item.code_commune,
    commune: item.com_name,
    code: item.app_code_synthese_eval_sanit,
  })),
  meta: response.meta,
});
