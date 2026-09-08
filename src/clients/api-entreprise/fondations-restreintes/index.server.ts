import routes from "#/clients/routes";
import type { IAgentScope } from "#/models/authentication/agent/scopes/constants";
import type { UseCase } from "#/models/use-cases";
import clientAPIEntreprise from "../client.server";
import type { IAPIEntrepriseFondationsRestreintes } from "./types";

/**
 * GET restricted foundation data from API Entreprise by SIREN, SIRET or RNF.
 */
export async function clientApiEntrepriseFondationsRestreintes(
  sirenOrSiretOrRnf: string,
  scope: IAgentScope | null,
  useCase?: UseCase
) {
  return await clientAPIEntreprise<
    IAPIEntrepriseFondationsRestreintes,
    IAPIEntrepriseFondationsRestreintes["data"]
  >(
    routes.apiEntreprise.fondationsRestreintes(sirenOrSiretOrRnf),
    (response) => response.data,
    { scope, useCase }
  );
}
