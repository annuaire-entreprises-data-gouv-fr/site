import routes from "#/clients/routes";
import type { ICollectiviteEtablissementsSirene } from "#/models/collectivite/economie-locale";
import { httpGet } from "#/utils/network";
import type { IEtablissementsSireneResponse } from "./types";

export const clientCollectiviteEtablissementsSirene = async (
  codeInsee: string
): Promise<ICollectiviteEtablissementsSirene> => {
  const response = await httpGet<IEtablissementsSireneResponse>(
    routes.economieLocale.etablissementsSirene(codeInsee)
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
