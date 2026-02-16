import {
  clientApiEntrepriseCarteProfessionnelleTravauxPublics,
  clientApiEntrepriseCibtp,
  clientApiEntrepriseCnetp,
  clientApiEntrepriseProbtp,
} from "#clients/api-entreprise/travaux-publics";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#models/authentication/user/rights";
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

const scope = ApplicationRightsToScopes[ApplicationRights.travauxPublics];

export const getTravauxPublic = async (
  slug: string,
  params: { useCase?: UseCase }
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
      scope,
      params.useCase
    ).catch(errorHandler),
    clientApiEntrepriseCibtp(siret, scope, params.useCase).catch(errorHandler),
    clientApiEntrepriseCnetp(siren, scope, params.useCase).catch(errorHandler),
    clientApiEntrepriseProbtp(siret, scope, params.useCase).catch(errorHandler),
  ]);
  return { fntp, cibtp, cnetp, probtp };
};
