import routes from "#/clients/routes";
import type { ICollectiviteEffectifsSalaries } from "#/models/collectivite/economie-locale";
import { httpGet } from "#/utils/network";
import type { IEffectifsSalariesResponse } from "./types";

export const clientCollectiviteEffectifsSalaries = async (
  codeInsee: string
): Promise<ICollectiviteEffectifsSalaries> => {
  if (!process.env.OVH_S3_AC_ENV_NAME) {
    throw new Error("OVH_S3_AC_ENV_NAME is not set");
  }
  const response = await httpGet<IEffectifsSalariesResponse>(
    routes.economieLocale.effectifsSalaries(
      process.env.OVH_S3_AC_ENV_NAME,
      codeInsee
    )
  );

  return mapToDomainObject(response);
};

const mapToDomainObject = (
  response: IEffectifsSalariesResponse
): ICollectiviteEffectifsSalaries => ({
  lastModified: response.date_mise_a_jour,
  source: response.source,
  effectifsSalaries: Object.fromEntries(
    Object.entries(response.donnees).map(([year, effectifs]) => [
      year,
      effectifs.map(({ effectif, grand_secteur_activite }) => ({
        effectif,
        grandSecteurActivite: grand_secteur_activite,
      })),
    ])
  ),
});
