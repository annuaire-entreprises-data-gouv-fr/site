import { ApplicationRights } from "#models/authentication/user/rights";
import { getAssociationProtected } from "#models/espace-agent/association-protected";
import { getOpqibi } from "#models/espace-agent/certificats/opqibi";
import { getQualibat } from "#models/espace-agent/certificats/qualibat";
import { getQualifelec } from "#models/espace-agent/certificats/qualifelec";
import { getDirigeantsProtected } from "#models/espace-agent/dirigeants-protected";
import { getEffectifsAnnuelsProtected } from "#models/espace-agent/effectifs/annuels";
import { getDocumentsRNEProtected } from "#models/espace-agent/rne-protected/documents";
import { getSubventionsAssociationFromSlug } from "#models/subventions/association";
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

export const getAgentAssociationProtectedFetcher = createAgentFetcher(
  getAssociationProtected
)
  .withApplicationRight(ApplicationRights.associationProtected)
  .build();

export const getAgentEffectifsAnnuelsProtectedFetcher = createAgentFetcher(
  getEffectifsAnnuelsProtected
)
  .withRateLimit()
  .withApplicationRight(ApplicationRights.effectifsAnnuels)
  .build();

export const getAgentSubventionsAssociationFetcher = createAgentFetcher(
  getSubventionsAssociationFromSlug
)
  .withRateLimit()
  .withApplicationRight(ApplicationRights.subventionsAssociation)
  .build();
