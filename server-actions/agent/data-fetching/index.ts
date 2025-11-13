"use server";

import { agentActionClient } from "server-actions/safe-action";
import { ApplicationRights } from "#models/authentication/user/rights";
import { getAssociationProtected } from "#models/espace-agent/association-protected";
import { getBeneficiaires } from "#models/espace-agent/beneficiaires";
import { getBilansProtected } from "#models/espace-agent/bilans";
import { getChiffreAffairesProtected } from "#models/espace-agent/chiffre-affaires";
import { getConformiteEntreprise } from "#models/espace-agent/conformite";
import { getLiassesFiscalesProtected } from "#models/espace-agent/dgfip/liasses-fiscales";
import { getDirigeantsProtected } from "#models/espace-agent/dirigeants-protected";
import { getEffectifsAnnuelsProtected } from "#models/espace-agent/effectifs/annuels";
import { getLiensCapitalistiquesProtected } from "#models/espace-agent/liens-capitalistiques";
import { getDocumentsRNEProtected } from "#models/espace-agent/rne-protected/documents";
import { getTravauxPublic } from "#models/espace-agent/travaux-publics";
import { getSubventionsAssociationFromSlug } from "#models/subventions/association";
import {
  withApplicationRight,
  withRateLimiting,
  withUseCase,
} from "../middlewares";
import {
  getAgentAssociationProtectedSchema,
  getAgentBeneficiairesSchema,
  getAgentBilansProtectedSchema,
  getAgentChiffreAffairesProtectedSchema,
  getAgentConformiteEntrepriseSchema,
  getAgentDirigeantsProtectedSchema,
  getAgentEffectifsAnnuelsProtectedSchema,
  getAgentLiassesFiscalesProtectedSchema,
  getAgentLiensCapitalistiquesProtectedSchema,
  getAgentRNEDocumentsSchema,
  getAgentSubventionsAssociationSchema,
  getAgentTravauxPublicsSchema,
} from "./schemas";

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

export const getAgentBilansProtectedAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.bilansBDF))
  .inputSchema(getAgentBilansProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siren, useCase } = parsedInput;
    return await getBilansProtected(siren, { useCase });
  });

export const getAgentChiffreAffairesProtectedAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.chiffreAffaires))
  .inputSchema(getAgentChiffreAffairesProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;
    return await getChiffreAffairesProtected(siret, { useCase });
  });

export const getAgentTravauxPublicsAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.travauxPublics))
  .inputSchema(getAgentTravauxPublicsSchema)
  .action(async ({ parsedInput }) => {
    const { siret, useCase } = parsedInput;
    return await getTravauxPublic(siret, { useCase });
  });

export const getAgentLiassesFiscalesProtectedAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.liassesFiscales))
  .inputSchema(getAgentLiassesFiscalesProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siren, year, useCase } = parsedInput;
    return await getLiassesFiscalesProtected(siren, { year, useCase });
  });

export const getAgentLiensCapitalistiquesProtectedAction = agentActionClient
  .use(withRateLimiting)
  .use(withUseCase)
  .use(withApplicationRight(ApplicationRights.liensCapitalistiques))
  .inputSchema(getAgentLiensCapitalistiquesProtectedSchema)
  .action(async ({ parsedInput }) => {
    const { siren, year, useCase } = parsedInput;
    return await getLiensCapitalistiquesProtected(siren, { year, useCase });
  });

export const getAgentSubventionsAssociationAction = agentActionClient
  .use(withRateLimiting)
  .use(withApplicationRight(ApplicationRights.subventionsAssociation))
  .inputSchema(getAgentSubventionsAssociationSchema)
  .action(async ({ parsedInput }) => {
    const { slug } = parsedInput;
    return await getSubventionsAssociationFromSlug(slug);
  });
