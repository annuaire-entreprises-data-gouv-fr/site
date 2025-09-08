import { HttpUnauthorizedError } from "#clients/exceptions";
import constants from "#models/constants";
import { InternalError } from "#models/exceptions";
import type { UseCase } from "#models/use-cases";
import { httpGet } from "#utils/network";
import { sensitiveRequestCallerInfos } from "#utils/network/utils/sensitive-request-caller-infos";
import { sensitiveRequestLogger } from "#utils/network/utils/sensitive-request-logger";
import { logFatalErrorInSentry } from "#utils/sentry";

export type IAPIEntrepriseResponse<T> = {
  data: T;
  links: {};
  meta: {};
};
/**
 * Wrapper client to call API Entreprise
 *
 * @param route
 * @param mapToDomainObject
 * @param recipientSiret
 * @returns
 */
export default async function clientAPIEntreprise<T, U>(
  route: string,
  mapToDomainObject: (e: T) => U,
  options?: {
    useCase?: UseCase;
  },
  publicRequest = false
) {
  const url = `${process.env.API_ENTREPRISE_URL}${route}`;
  const useCase = options?.useCase ? options.useCase : "annuaire-entreprises";

  const callerInfos = publicRequest
    ? {
        siret: "13002526500013",
        email: "dinum@dinum.fr",
        scopes: [],
        domain: "public",
      }
    : await sensitiveRequestCallerInfos();

  if (!publicRequest) {
    sensitiveRequestLogger(url, callerInfos, useCase);
  }

  if (!callerInfos.siret) {
    logFatalErrorInSentry(
      new InternalError({
        message: "Missing recipient siret",
        context: { domain: callerInfos.domain },
      })
    );
    throw new HttpUnauthorizedError("Missing recipient siret");
  }

  if (!process.env.API_ENTREPRISE_URL || !process.env.API_ENTREPRISE_TOKEN) {
    throw new HttpUnauthorizedError("Missing API Entreprise credentials");
  }

  const response = await httpGet<T>(url, {
    headers: {
      Authorization: `Bearer ${process.env.API_ENTREPRISE_TOKEN}`,
    },
    timeout: constants.timeout.XXXL,
    params: {
      object: publicRequest ? "open-data" : "espace-agent-public",
      context: useCase,
      recipient: callerInfos.siret,
    },
  });

  return mapToDomainObject(response);
}
