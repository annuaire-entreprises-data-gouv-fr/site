import routes from "#/clients/routes";
import type { ICollectiviteEtablissementsSirene } from "#/models/collectivite/economie-locale";
import { httpGet } from "#/utils/network";
import type { IEtablissementsSireneResponse } from "./types";

export const clientCollectiviteEtablissementsSirene = async (
  codeInsee: string
): Promise<ICollectiviteEtablissementsSirene> => {
  if (!process.env.OVH_S3_AC_ENV_NAME) {
    throw new Error("OVH_S3_AC_ENV_NAME is not set");
  }
  const response = await httpGet<IEtablissementsSireneResponse>(
    routes.economieLocale.etablissementsSirene(
      process.env.OVH_S3_AC_ENV_NAME,
      codeInsee
    )
  );

  return mapToDomainObject(response);
};

const mapToDomainObject = (
  response: IEtablissementsSireneResponse
): ICollectiviteEtablissementsSirene => ({
  lastModified: response.date_mise_a_jour,
  source: response.source,
  etablissements: response.donnees.map(({ lat, lon, nom, siret }) => ({
    lat,
    lon,
    nom,
    siret,
  })),
});
