import { HttpUnauthorizedError } from "#clients/exceptions";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { Siret } from "#utils/helpers";
import getSession from "#utils/server-side-helper/get-session";
import type { ISensitiveCaller } from "./sensitive-request-logger";

export async function sensitiveRequestCallerInfos(
  scope?: IAgentScope | null
): Promise<ISensitiveCaller> {
  const session = await getSession();

  if (session?.user) {
    const { email, domain, scopes = [], groupsScopes = {} } = session.user;

    let siret = session.user.siret;

    if (scope) {
      siret =
        Object.keys(groupsScopes).find((siret) =>
          groupsScopes[siret as Siret].includes(scope)
        ) || session.user.siret;
    }

    if (!email) {
      throw new HttpUnauthorizedError("Sensitive requests require an email");
    }

    return {
      email,
      siret,
      scopes,
      domain,
    };
  }
  throw new HttpUnauthorizedError(
    "Sensitive requests require an authenticated user"
  );
}
