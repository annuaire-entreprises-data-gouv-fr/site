"use server";

import { agentActionClient } from "server-actions/safe-action";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#models/authentication/user/rights";
import { getBeneficiaires } from "#models/espace-agent/beneficiaires";
import { getBilansProtected } from "#models/espace-agent/bilans";
import { getChiffreAffairesProtected } from "#models/espace-agent/chiffre-affaires";
import { getConformiteEntreprise } from "#models/espace-agent/conformite";
import { getLiassesFiscalesProtected } from "#models/espace-agent/dgfip/liasses-fiscales";
import { getLiensCapitalistiquesProtected } from "#models/espace-agent/liens-capitalistiques";
import { getTravauxPublic } from "#models/espace-agent/travaux-publics";
import {
  withApplicationRight,
  withRateLimiting,
  withUseCase,
} from "../middlewares";
import {
  getAgentBeneficiairesSchema,
  getAgentBilansProtectedSchema,
  getAgentChiffreAffairesProtectedSchema,
  getAgentConformiteEntrepriseSchema,
  getAgentLiassesFiscalesProtectedSchema,
  getAgentLiensCapitalistiquesProtectedSchema,
  getAgentTravauxPublicsSchema,
} from "./schemas";

export const getAgentBeneficiairesAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.beneficiaires))
  .inputSchema(getAgentBeneficiairesSchema)
  .action(async ({ parsedInput }) => {
    const { siren, useCase } = parsedInput;
    return await getBeneficiaires(
      siren,
      ApplicationRightsToScopes[ApplicationRights.beneficiaires],
      useCase
    );
  });

export const getAgentConformiteEntrepriseAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.conformite))
  .inputSchema(getAgentConformiteEntrepriseSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;

    return await getConformiteEntreprise(siret, {
      scope: ApplicationRightsToScopes[ApplicationRights.conformite],
      useCase,
    });
  });

export const getAgentBilansProtectedAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.bilansBDF))
  .inputSchema(getAgentBilansProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siren, useCase } = parsedInput;
    return await getBilansProtected(siren, {
      scope: ApplicationRightsToScopes[ApplicationRights.bilansBDF],
      useCase,
    });
  });

export const getAgentChiffreAffairesProtectedAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.chiffreAffaires))
  .inputSchema(getAgentChiffreAffairesProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;
    return await getChiffreAffairesProtected(siret, {
      scope: ApplicationRightsToScopes[ApplicationRights.chiffreAffaires],
      useCase,
    });
  });

export const getAgentTravauxPublicsAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.travauxPublics))
  .inputSchema(getAgentTravauxPublicsSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;
    return await getTravauxPublic(siret, {
      scope: ApplicationRightsToScopes[ApplicationRights.travauxPublics],
      useCase,
    });
  });

export const getAgentLiassesFiscalesProtectedAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.liassesFiscales))
  .inputSchema(getAgentLiassesFiscalesProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siren, year, useCase } = parsedInput;
    return await getLiassesFiscalesProtected(siren, {
      scope: ApplicationRightsToScopes[ApplicationRights.liassesFiscales],
      year,
      useCase,
    });
  });

export const getAgentLiensCapitalistiquesProtectedAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.liensCapitalistiques))
  .inputSchema(getAgentLiensCapitalistiquesProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siren, year, useCase } = parsedInput;
    return await getLiensCapitalistiquesProtected(siren, {
      scope: ApplicationRightsToScopes[ApplicationRights.liensCapitalistiques],
      year,
      useCase,
    });
  });
