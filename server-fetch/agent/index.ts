import type { IAPINotRespondingError } from "#models/api-not-responding";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import {
  getOpqibi,
  type IOpqibi,
} from "#models/espace-agent/certificats/opqibi";
import {
  getQualibat,
  type IQualibat,
} from "#models/espace-agent/certificats/qualibat";
import {
  getQualifelec,
  type IQualifelec,
} from "#models/espace-agent/certificats/qualifelec";
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

export const getQualibatFetcher = withErrorHandler<
  IQualibat | IAPINotRespondingError,
  [string, ISession | null]
>((siret, session) =>
  withApplicationRight(
    withAgentRateLimiter(
      () => getQualibat(siret),
      session?.user?.email ?? null
    ),
    ApplicationRights.protectedCertificats,
    session
  )(siret, session)
);

export const getQualifelecFetcher = withErrorHandler<
  IQualifelec | IAPINotRespondingError,
  [string, ISession | null]
>((siret, session) =>
  withApplicationRight(
    withAgentRateLimiter(
      () => getQualifelec(siret),
      session?.user?.email ?? null
    ),
    ApplicationRights.protectedCertificats,
    session
  )(siret, session)
);
