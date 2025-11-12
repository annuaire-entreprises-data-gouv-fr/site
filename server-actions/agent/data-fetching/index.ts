"use server";

import { agentActionClient } from "server-actions/safe-action";
import { ApplicationRights } from "#models/authentication/user/rights";
import { getOpqibi } from "#models/espace-agent/certificats/opqibi";
import { getQualibat } from "#models/espace-agent/certificats/qualibat";
import { getConformiteEntreprise } from "#models/espace-agent/conformite";
import {
  withApplicationRight,
  withRateLimiting,
  withUseCase,
} from "../middlewares";
import {
  getAgentConformiteEntrepriseSchema,
  getAgentOpqibiSchema,
  getAgentQualibatSchema,
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

export const getAgentConformiteEntrepriseAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.conformite))
  .inputSchema(getAgentConformiteEntrepriseSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;

    return await getConformiteEntreprise(siret, { useCase });
  });
