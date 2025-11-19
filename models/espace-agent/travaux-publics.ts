import {
  clientApiEntrepriseCarteProfessionnelleTravauxPublics,
  clientApiEntrepriseCibtp,
  clientApiEntrepriseCnetp,
  clientApiEntrepriseProbtp,
} from "#clients/api-entreprise/travaux-publics";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { UseCase } from "#models/use-cases";
import { extractSirenFromSiret, verifySiret } from "#utils/helpers";
import { handleApiEntrepriseError } from "./utils";

export type IDocumentDownloader = {
  url: string;
};

export type ITravauxPublics = {
  fntp: IDocumentDownloader | IAPINotRespondingError;
  cibtp: IDocumentDownloader | IAPINotRespondingError;
  cnetp: IDocumentDownloader | IAPINotRespondingError;
  probtp: IDocumentDownloader | IAPINotRespondingError;
};

export const getTravauxPublic = async (
  slug: string,
  params: { useCase?: UseCase; scope: IAgentScope | null }
): Promise<ITravauxPublics | IAPINotRespondingError> => {
  const siret = verifySiret(slug as string);
  const siren = extractSirenFromSiret(siret);

  const errorHandler = (e: any) =>
    handleApiEntrepriseError(e, {
      siren,
      siret,
      apiResource: "TravauxPublics",
    });

  const [fntp, cibtp, cnetp, probtp] = await Promise.all([
    clientApiEntrepriseCarteProfessionnelleTravauxPublics(
      siren,
      params.scope,
      params.useCase
    ).catch(errorHandler),
    clientApiEntrepriseCibtp(siret, params.scope, params.useCase).catch(
      errorHandler
    ),
    clientApiEntrepriseCnetp(siren, params.scope, params.useCase).catch(
      errorHandler
    ),
    clientApiEntrepriseProbtp(siret, params.scope, params.useCase).catch(
      errorHandler
    ),
  ]);
  return { fntp, cibtp, cnetp, probtp };
};
