"use server";

import { agentActionClient } from "server-actions/safe-action";
import { ApplicationRights } from "#models/authentication/user/rights";
import { getBeneficiaires } from "#models/espace-agent/beneficiaires";
import { getBilansProtected } from "#models/espace-agent/bilans";
import { getChiffreAffairesProtected } from "#models/espace-agent/chiffre-affaires";
import {
  getConformiteFiscaleEntreprise,
  getConformiteSocialeEntreprise,
} from "#models/espace-agent/conformite";
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
  getAgentConformiteFiscaleEntrepriseSchema,
  getAgentConformiteSocialeEntrepriseSchema,
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
    return await getBeneficiaires(siren, { useCase });
  });

export const getAgentConformiteSocialeEntrepriseAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.conformiteSociale))
  .inputSchema(getAgentConformiteSocialeEntrepriseSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;

    return await getConformiteSocialeEntreprise(siret, {
      useCase,
    });
  });

export const getAgentConformiteFiscaleEntrepriseAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.conformiteFiscale))
  .inputSchema(getAgentConformiteFiscaleEntrepriseSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;

    return await getConformiteFiscaleEntreprise(siret, {
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
      year,
      useCase,
    });
  });
