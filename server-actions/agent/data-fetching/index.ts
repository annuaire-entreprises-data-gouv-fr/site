"use server";

import { agentActionClient } from "server-actions/safe-action";
import { ApplicationRights } from "#models/authentication/user/rights";
import { getOpqibi } from "#models/espace-agent/certificats/opqibi";
import { getConformiteEntreprise } from "#models/espace-agent/conformite";
import {
  withApplicationRight,
  withRateLimiting,
  withUseCase,
} from "../middlewares";
import {
  getAgentConformiteEntrepriseSchema,
  getAgentOpqibiSchema,
} from "./schemas";

export const getAgentOpqibiAction = agentActionClient
  .use(withRateLimiting)
  .use(withApplicationRight(ApplicationRights.protectedCertificats))
  .inputSchema(getAgentOpqibiSchema)
  .action(async ({ parsedInput }) => {
    const { siren } = parsedInput;
    return await getOpqibi(siren);
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
