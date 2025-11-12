"use server";

import { agentActionClient } from "server-actions/safe-action";
import { ApplicationRights } from "#models/authentication/user/rights";
import { getAssociationProtected } from "#models/espace-agent/association-protected";
import { getBeneficiaires } from "#models/espace-agent/beneficiaires";
import { getOpqibi } from "#models/espace-agent/certificats/opqibi";
import { getQualibat } from "#models/espace-agent/certificats/qualibat";
import { getQualifelec } from "#models/espace-agent/certificats/qualifelec";
import { getConformiteEntreprise } from "#models/espace-agent/conformite";
import { getDirigeantsProtected } from "#models/espace-agent/dirigeants-protected";
import { getEffectifsAnnuelsProtected } from "#models/espace-agent/effectifs/annuels";
import { getDocumentsRNEProtected } from "#models/espace-agent/rne-protected/documents";
import {
  withApplicationRight,
  withRateLimiting,
  withUseCase,
} from "../middlewares";
import {
  getAgentAssociationProtectedSchema,
  getAgentBeneficiairesSchema,
  getAgentConformiteEntrepriseSchema,
  getAgentDirigeantsProtectedSchema,
  getAgentEffectifsAnnuelsProtectedSchema,
  getAgentOpqibiSchema,
  getAgentQualibatSchema,
  getAgentQualifelecSchema,
  getAgentRNEDocumentsSchema,
} from "./schemas";

export const getAgentOpqibiAction = agentActionClient
  .use(withRateLimiting)
  .use(withApplicationRight(ApplicationRights.protectedCertificats))
  .inputSchema(getAgentOpqibiSchema)
  .action(async ({ parsedInput }) => {
    const { siren } = parsedInput;
    return await getOpqibi(siren);
  });

export const getAgentQualibatAction = agentActionClient
  .use(withRateLimiting)
  .use(withApplicationRight(ApplicationRights.protectedCertificats))
  .inputSchema(getAgentQualibatSchema)
  .action(async ({ parsedInput }) => {
    const { siret } = parsedInput;
    return await getQualibat(siret);
  });

export const getAgentQualifelecAction = agentActionClient
  .use(withRateLimiting)
  .use(withApplicationRight(ApplicationRights.protectedCertificats))
  .inputSchema(getAgentQualifelecSchema)
  .action(async ({ parsedInput }) => {
    const { siret } = parsedInput;
    return await getQualifelec(siret);
  });

export const getAgentDirigeantsProtectedAction = agentActionClient
  .use(withRateLimiting)
  .use(withApplicationRight(ApplicationRights.mandatairesRCS))
  .inputSchema(getAgentDirigeantsProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siren, isEI } = parsedInput;
    return await getDirigeantsProtected(siren, isEI);
  });

export const getAgentBeneficiairesAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.beneficiaires))
  .inputSchema(getAgentBeneficiairesSchema)
  .action(async ({ parsedInput }) => {
    const { siren, useCase } = parsedInput;
    return await getBeneficiaires(siren, useCase);
  });

export const getAgentConformiteEntrepriseAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.conformite))
  .inputSchema(getAgentConformiteEntrepriseSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;

    return await getConformiteEntreprise(siret, { useCase });
  });

export const getAgentRNEDocumentsAction = agentActionClient
  .use(withRateLimiting)
  .use(withApplicationRight(ApplicationRights.documentsRne))
  .inputSchema(getAgentRNEDocumentsSchema)
  .action(async ({ parsedInput }) => {
    const { siren } = parsedInput;
    return await getDocumentsRNEProtected(siren);
  });

export const getAgentAssociationProtectedAction = agentActionClient
  .use(withApplicationRight(ApplicationRights.associationProtected))
  .inputSchema(getAgentAssociationProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siren } = parsedInput;
    return await getAssociationProtected(siren);
  });

export const getAgentEffectifsAnnuelsProtectedAction = agentActionClient
  .use(withRateLimiting)
  .use(withApplicationRight(ApplicationRights.effectifsAnnuels))
  .inputSchema(getAgentEffectifsAnnuelsProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siren } = parsedInput;
    return await getEffectifsAnnuelsProtected(siren);
  });
