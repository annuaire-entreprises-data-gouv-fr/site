import routes from "#/clients/routes";
import type { ICollectiviteFluxOuvertureEtablissements } from "#/models/collectivite/economie-locale";
import { httpGet } from "#/utils/network";
import type { IFluxOuvertureEtablissementsResponse } from "./types";

export const clientCollectiviteFluxOuvertureEtablissements = async (
  codeInsee: string
): Promise<ICollectiviteFluxOuvertureEtablissements> => {
  const response = await httpGet<IFluxOuvertureEtablissementsResponse>(
    routes.economieLocale.fluxOuvertureEtablissements(codeInsee)
  );

  return mapToDomainObject(response);
};

const mapToDomainObject = (
  response: IFluxOuvertureEtablissementsResponse
): ICollectiviteFluxOuvertureEtablissements => ({
  lastModified: response.date_mise_a_jour,
  source: response.source,
  fluxEtablissements: response.donnees.map(
    ({ fermetures, mois, ouvertures }) => ({ fermetures, mois, ouvertures })
  ),
});
