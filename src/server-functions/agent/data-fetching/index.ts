import { createServerFn } from "@tanstack/react-start";
import { clientMinimis } from "#/clients/api-data-gouv/minimis";
import { ApplicationRights } from "#/models/authentication/user/rights";
import { getAssociationProtected } from "#/models/espace-agent/association-protected";
import { getBeneficiaires } from "#/models/espace-agent/beneficiaires";
import { getBilansProtected } from "#/models/espace-agent/bilans";
import { getOpqibi } from "#/models/espace-agent/certificats/opqibi";
import { getQualibat } from "#/models/espace-agent/certificats/qualibat";
import { getQualifelec } from "#/models/espace-agent/certificats/qualifelec";
import { getChiffreAffairesProtected } from "#/models/espace-agent/chiffre-affaires";
import {
  getConformiteFiscaleEntreprise,
  getConformiteSocialeEntreprise,
} from "#/models/espace-agent/conformite";
import { getLiassesFiscalesProtected } from "#/models/espace-agent/dgfip/liasses-fiscales";
import { getDirigeantsProtected } from "#/models/espace-agent/dirigeants-protected";
import { getEffectifsAnnuelsProtected } from "#/models/espace-agent/effectifs/annuels";
import { getEffectifsMensuelsProtected } from "#/models/espace-agent/effectifs/mensuels";
import { getLiensCapitalistiquesProtected } from "#/models/espace-agent/liens-capitalistiques";
import { getDocumentsRNEProtected } from "#/models/espace-agent/rne-protected/documents";
import { getTravauxPublic } from "#/models/espace-agent/travaux-publics";
import { getSubventionsAssociationFromSlug } from "#/models/subventions/association";
import {
  agentFnMiddleware,
  withApplicationRight,
} from "#/server-functions/middlewares";
import { withRateLimiting, withUseCase } from "../middlewares";
import {
  getAgentAidesMinimisSchema,
  getAgentAssociationProtectedSchema,
  getAgentBeneficiairesSchema,
  getAgentBilansProtectedSchema,
  getAgentChiffreAffairesProtectedSchema,
  getAgentConformiteFiscaleEntrepriseSchema,
  getAgentConformiteSocialeEntrepriseSchema,
  getAgentDirigeantsProtectedSchema,
  getAgentDocumentsRNEProtectedSchema,
  getAgentEffectifsAnnuelsProtectedSchema,
  getAgentEffectifsMensuelsProtectedSchema,
  getAgentLiassesFiscalesProtectedSchema,
  getAgentLiensCapitalistiquesProtectedSchema,
  getAgentOpqibiSchema,
  getAgentQualibatSchema,
  getAgentQualifelecSchema,
  getAgentTravauxPublicsSchema,
  getSubventionsAssociationSchema,
} from "./schemas";

export const getAgentBeneficiairesFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.beneficiaires),
    withRateLimiting,
    withUseCase,
  ])
  .inputValidator(getAgentBeneficiairesSchema)
  .handler(async ({ data }) => {
    const { siren, useCase } = data;
    return await getBeneficiaires(siren, { useCase });
  });

export const getAgentConformiteSocialeEntrepriseFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.conformiteSociale),
    withRateLimiting,
    withUseCase,
  ])
  .inputValidator(getAgentConformiteSocialeEntrepriseSchema)
  .handler(async ({ data }) => {
    const { siret, useCase } = data;
    return await getConformiteSocialeEntreprise(siret, { useCase });
  });

export const getAgentConformiteFiscaleEntrepriseFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.conformiteFiscale),
    withRateLimiting,
    withUseCase,
  ])
  .inputValidator(getAgentConformiteFiscaleEntrepriseSchema)
  .handler(async ({ data }) => {
    const { siret, useCase } = data;
    return await getConformiteFiscaleEntreprise(siret, { useCase });
  });

export const getAgentBilansProtectedFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.bilansBDF),
    withRateLimiting,
    withUseCase,
  ])
  .inputValidator(getAgentBilansProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, useCase } = data;
    return await getBilansProtected(siren, { useCase });
  });

export const getAgentChiffreAffairesProtectedFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.chiffreAffaires),
    withRateLimiting,
    withUseCase,
  ])
  .inputValidator(getAgentChiffreAffairesProtectedSchema)
  .handler(async ({ data }) => {
    const { siret, useCase } = data;
    return await getChiffreAffairesProtected(siret, { useCase });
  });

export const getAgentTravauxPublicsFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.travauxPublics),
    withRateLimiting,
    withUseCase,
  ])
  .inputValidator(getAgentTravauxPublicsSchema)
  .handler(async ({ data }) => {
    const { siret, useCase } = data;
    return await getTravauxPublic(siret, { useCase });
  });

export const getAgentLiassesFiscalesProtectedFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.liassesFiscales),
    withRateLimiting,
    withUseCase,
  ])
  .inputValidator(getAgentLiassesFiscalesProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, year, useCase } = data;
    return await getLiassesFiscalesProtected(siren, { year, useCase });
  });

export const getAgentLiensCapitalistiquesProtectedFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.liensCapitalistiques),
    withRateLimiting,
    withUseCase,
  ])
  .inputValidator(getAgentLiensCapitalistiquesProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, year, useCase } = data;
    return await getLiensCapitalistiquesProtected(siren, { year, useCase });
  });

export const getAgentAidesMinimisFn = createServerFn()
  .middleware([agentFnMiddleware, withRateLimiting])
  .inputValidator(getAgentAidesMinimisSchema)
  .handler(async ({ data }) => {
    const { siren, page } = data;
    return await clientMinimis(siren, page);
  });

/** Previous API routes */

export const getAgentOpqibiFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.protectedCertificats),
    withRateLimiting,
  ])
  .inputValidator(getAgentOpqibiSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getOpqibi(siren);
  });

export const getAgentQualibatFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.protectedCertificats),
    withRateLimiting,
  ])
  .inputValidator(getAgentQualibatSchema)
  .handler(async ({ data }) => {
    const { siret } = data;
    return await getQualibat(siret);
  });

export const getAgentQualifelecFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.protectedCertificats),
    withRateLimiting,
  ])
  .inputValidator(getAgentQualifelecSchema)
  .handler(async ({ data }) => {
    const { siret } = data;
    return await getQualifelec(siret);
  });

export const getAgentDirigeantsProtectedFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.mandatairesRCS),
    withRateLimiting,
  ])
  .inputValidator(getAgentDirigeantsProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, isEI } = data;
    return await getDirigeantsProtected(siren, { isEI });
  });

export const getAgentRneDocumentsFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.documentsRne),
    withRateLimiting,
  ])
  .inputValidator(getAgentDocumentsRNEProtectedSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getDocumentsRNEProtected(siren);
  });

export const getAgentAssociationProtectedFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.associationProtected),
  ])
  .inputValidator(getAgentAssociationProtectedSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getAssociationProtected(siren);
  });

export const getAgentEffectifsAnnuelsProtectedFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.effectifs),
    withRateLimiting,
  ])
  .inputValidator(getAgentEffectifsAnnuelsProtectedSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getEffectifsAnnuelsProtected(siren);
  });

export const getAgentEffectifsMensuelsProtectedFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.effectifs),
    withRateLimiting,
  ])
  .inputValidator(getAgentEffectifsMensuelsProtectedSchema)
  .handler(async ({ data }) => {
    const { siret, year, useCase, natureEffectif } = data;
    return await getEffectifsMensuelsProtected(siret, {
      year,
      useCase,
      natureEffectif,
    });
  });

export const getSubventionsAssociationFn = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.subventionsAssociation),
    withRateLimiting,
  ])
  .inputValidator(getSubventionsAssociationSchema)
  .handler(async ({ data }) => {
    const { slug } = data;
    return await getSubventionsAssociationFromSlug(slug);
  });
