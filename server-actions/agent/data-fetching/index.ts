"use server";

import { agentActionClient } from "server-actions/safe-action";
import { ApplicationRights } from "#models/authentication/user/rights";
import { getOpqibi } from "#models/espace-agent/certificats/opqibi";
import { getQualibat } from "#models/espace-agent/certificats/qualibat";
import { getQualifelec } from "#models/espace-agent/certificats/qualifelec";
import { getConformiteEntreprise } from "#models/espace-agent/conformite";
import { getDirigeantsProtected } from "#models/espace-agent/dirigeants-protected";
import {
  withApplicationRight,
  withRateLimiting,
  withUseCase,
} from "../middlewares";
import {
  getAgentConformiteEntrepriseSchema,
  getAgentDirigeantsProtectedSchema,
  getAgentOpqibiSchema,
  getAgentQualibatSchema,
  getAgentQualifelecSchema,
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

export const getAgentConformiteEntrepriseAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.conformite))
  .inputSchema(getAgentConformiteEntrepriseSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;

    return await getConformiteEntreprise(siret, { useCase });
  });
