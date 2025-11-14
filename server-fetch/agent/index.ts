import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { getAssociationProtected } from "#models/espace-agent/association-protected";
import { getOpqibi } from "#models/espace-agent/certificats/opqibi";
import { getQualibat } from "#models/espace-agent/certificats/qualibat";
import { getQualifelec } from "#models/espace-agent/certificats/qualifelec";
import { getDirigeantsProtected } from "#models/espace-agent/dirigeants-protected";
import { getEffectifsAnnuelsProtected } from "#models/espace-agent/effectifs/annuels";
import { getDocumentsRNEProtected } from "#models/espace-agent/rne-protected/documents";
import { getSubventionsAssociationFromSlug } from "#models/subventions/association";
import type { Siren, Siret } from "#utils/helpers";
import { withErrorHandler } from "../middlewares";
import { withAgentRateLimiter, withApplicationRight } from "./middlewares";

export const getOpqibiFetcher = withErrorHandler(
  (siren: Siren, session: ISession | null) =>
    withApplicationRight(
      withAgentRateLimiter(
        () => getOpqibi(siren),
        session?.user?.email ?? null
      ),
      ApplicationRights.protectedCertificats,
      session
    )(siren, session)
);

export const getQualibatFetcher = withErrorHandler(
  (siret: Siret, session: ISession | null) =>
    withApplicationRight(
      withAgentRateLimiter(
        () => getQualibat(siret),
        session?.user?.email ?? null
      ),
      ApplicationRights.protectedCertificats,
      session
    )(siret, session)
);

export const getQualifelecFetcher = withErrorHandler(
  (siret: Siret, session: ISession | null) =>
    withApplicationRight(
      withAgentRateLimiter(
        () => getQualifelec(siret),
        session?.user?.email ?? null
      ),
      ApplicationRights.protectedCertificats,
      session
    )(siret, session)
);

export const getDirigeantsProtectedFetcher = withErrorHandler(
  (siren: Siren, isEI: boolean, session: ISession | null) =>
    withApplicationRight(
      withAgentRateLimiter(
        () => getDirigeantsProtected(siren, isEI),
        session?.user?.email ?? null
      ),
      ApplicationRights.mandatairesRCS,
      session
    )(siren, session)
);

export const getAgentRNEDocumentsFetcher = withErrorHandler(
  (siren: Siren, session: ISession | null) =>
    withApplicationRight(
      withAgentRateLimiter(
        () => getDocumentsRNEProtected(siren),
        session?.user?.email ?? null
      ),
      ApplicationRights.documentsRne,
      session
    )(siren, session)
);

export const getAgentAssociationProtectedFetcher = withErrorHandler(
  (siren: Siren, session: ISession | null) =>
    withApplicationRight(
      () => getAssociationProtected(siren),
      ApplicationRights.associationProtected,
      session
    )(siren, session)
);

export const getAgentEffectifsAnnuelsProtectedFetcher = withErrorHandler(
  (siren: Siren, session: ISession | null) =>
    withApplicationRight(
      withAgentRateLimiter(
        () => getEffectifsAnnuelsProtected(siren),
        session?.user?.email ?? null
      ),
      ApplicationRights.effectifsAnnuels,
      session
    )(siren, session)
);

export const getAgentSubventionsAssociationFetcher = withErrorHandler(
  (siren: Siren, session: ISession | null) =>
    withApplicationRight(
      withAgentRateLimiter(
        () => getSubventionsAssociationFromSlug(siren),
        session?.user?.email ?? null
      ),
      ApplicationRights.subventionsAssociation,
      session
    )(siren, session)
);
