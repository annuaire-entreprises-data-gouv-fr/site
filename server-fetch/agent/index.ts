import type { IAPINotRespondingError } from "#models/api-not-responding";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import {
  getAssociationProtected,
  type IAssociationProtected,
} from "#models/espace-agent/association-protected";
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
import { getDirigeantsProtected } from "#models/espace-agent/dirigeants-protected";
import {
  getEffectifsAnnuelsProtected,
  type IEffectifsAnnuelsProtected,
} from "#models/espace-agent/effectifs/annuels";
import { getDocumentsRNEProtected } from "#models/espace-agent/rne-protected/documents";
import type {
  IDirigeantsWithMetadataMergedIGInpi,
  IDocumentsRNE,
} from "#models/rne/types";
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

export const getDirigeantsProtectedFetcher = withErrorHandler<
  IDirigeantsWithMetadataMergedIGInpi | IAPINotRespondingError,
  [string, boolean, ISession | null]
>((siren, isEI, session) =>
  withApplicationRight(
    withAgentRateLimiter(
      () => getDirigeantsProtected(siren, isEI),
      session?.user?.email ?? null
    ),
    ApplicationRights.mandatairesRCS,
    session
  )(siren, session)
);

export const getAgentRNEDocumentsFetcher = withErrorHandler<
  IDocumentsRNE | IAPINotRespondingError,
  [string, ISession | null]
>((siren, session) =>
  withApplicationRight(
    withAgentRateLimiter(
      () => getDocumentsRNEProtected(siren),
      session?.user?.email ?? null
    ),
    ApplicationRights.documentsRne,
    session
  )(siren, session)
);

export const getAgentAssociationProtectedFetcher = withErrorHandler<
  IAssociationProtected | IAPINotRespondingError,
  [string, ISession | null]
>((siren, session) =>
  withApplicationRight(
    () => getAssociationProtected(siren),
    ApplicationRights.associationProtected,
    session
  )(siren, session)
);

export const getAgentEffectifsAnnuelsProtectedFetcher = withErrorHandler<
  IEffectifsAnnuelsProtected | IAPINotRespondingError,
  [string, ISession | null]
>((siren, session) =>
  withApplicationRight(
    withAgentRateLimiter(
      () => getEffectifsAnnuelsProtected(siren),
      session?.user?.email ?? null
    ),
    ApplicationRights.effectifsAnnuels,
    session
  )(siren, session)
);
