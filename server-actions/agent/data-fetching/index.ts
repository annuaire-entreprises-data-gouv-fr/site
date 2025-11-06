"use server";

import { agentActionClient } from "server-actions/safe-action";
import { ApplicationRights } from "#models/authentication/user/rights";
import { getConformiteEntreprise } from "#models/espace-agent/conformite";
import {
  withApplicationRight,
  withRateLimiting,
  withUseCase,
} from "../middlewares";
import { getAgentConformiteEntrepriseSchema } from "./schemas";

export const getAgentConformiteEntrepriseAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.conformite))
  .inputSchema(getAgentConformiteEntrepriseSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;

    return await getConformiteEntreprise(siret, { useCase });
  });
