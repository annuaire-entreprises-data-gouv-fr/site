import { ApplicationRights } from "#models/authentication/user/rights";
import { getOpqibi } from "#models/espace-agent/certificats/opqibi";
import { getQualibat } from "#models/espace-agent/certificats/qualibat";
import { getQualifelec } from "#models/espace-agent/certificats/qualifelec";
import { getDirigeantsProtected } from "#models/espace-agent/dirigeants-protected";
import { getDocumentsRNEProtected } from "#models/espace-agent/rne-protected/documents";
import { createAgentFetcher } from "./middlewares";

export const getOpqibiFetcher = createAgentFetcher(getOpqibi)
  .withRateLimit()
  .withApplicationRight(ApplicationRights.protectedCertificats)
  .build();

export const getQualibatFetcher = createAgentFetcher(getQualibat)
  .withRateLimit()
  .withApplicationRight(ApplicationRights.protectedCertificats)
  .build();

export const getQualifelecFetcher = createAgentFetcher(getQualifelec)
  .withRateLimit()
  .withApplicationRight(ApplicationRights.protectedCertificats)
  .build();

export const getDirigeantsProtectedFetcher = createAgentFetcher(
  getDirigeantsProtected
)
  .withRateLimit()
  .withApplicationRight(ApplicationRights.mandatairesRCS)
  .build();

export const getAgentRNEDocumentsFetcher = createAgentFetcher(
  getDocumentsRNEProtected
)
  .withRateLimit()
  .withApplicationRight(ApplicationRights.documentsRne)
  .build();
