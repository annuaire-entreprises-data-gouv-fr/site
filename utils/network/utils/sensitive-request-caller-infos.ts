import { HttpUnauthorizedError } from "#clients/exceptions";
import getSession from "#utils/server-side-helper/get-session";
import type { ISensitiveCaller } from "./sensitive-request-logger";

export async function sensitiveRequestCallerInfos(): Promise<ISensitiveCaller> {
  const session = await getSession();

  if (session?.user) {
    const { email, domain, siret = null, scopes = [] } = session.user;

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
