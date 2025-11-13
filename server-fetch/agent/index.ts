import type { IAPINotRespondingError } from "#models/api-not-responding";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import {
  getOpqibi,
  type IOpqibi,
} from "#models/espace-agent/certificats/opqibi";
import { withAgentRateLimiter } from "#utils/server-side-helper/with-agent-rate-limiter";
import { withApplicationRight } from "#utils/server-side-helper/with-application-right";
import { withErrorHandler } from "#utils/server-side-helper/with-error-handler";

export const getOpqibiFetcher = withErrorHandler<
  IOpqibi | IAPINotRespondingError,
  [string, ISession | null]
>((siren, session) =>
  withApplicationRight(
    withAgentRateLimiter(() => getOpqibi(siren), session?.user?.email ?? null),
    ApplicationRights.protectedCertificats,
    session
  )(siren, session)
);
