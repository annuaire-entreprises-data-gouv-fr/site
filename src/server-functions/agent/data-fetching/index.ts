import { createServerFn } from "@tanstack/react-start";
import { clientMinimis } from "#/clients/api-data-gouv/minimis";
import { getAssociationFromSlug } from "#/models/association";
import { ApplicationRights } from "#/models/authentication/user/rights";
import { getEORIValidation } from "#/models/eori-validation";
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
import { getDirigeantsRNE } from "#/models/rne/dirigeants";
import { getRNEObservations } from "#/models/rne/observations";
import { getSubventionsAssociationFromSlug } from "#/models/subventions/association";
import { buildAndVerifyTVA } from "#/models/tva/verify";
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
  getAgentDirigeantsSchema,
  getAgentDocumentsRNEProtectedSchema,
  getAgentEffectifsAnnuelsProtectedSchema,
  getAgentEffectifsMensuelsProtectedSchema,
  getAgentLiassesFiscalesProtectedSchema,
  getAgentLiensCapitalistiquesProtectedSchema,
  getAgentObservationsSchema,
  getAgentOpqibiSchema,
  getAgentQualibatSchema,
  getAgentQualifelecSchema,
  getAgentTravauxPublicsSchema,
  getAssociationSchema,
  getSubventionsAssociationSchema,
  validateEORISchema,
  verifyTvaSchema,
} from "./schemas";

export const getAgentBeneficiairesAction = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.beneficiaires),
  ])
  .inputValidator(getAgentBeneficiairesSchema)
  .handler(async ({ data }) => {
    const { siren, useCase } = data;
    return await getBeneficiaires(siren, { useCase });
  });

export const getAgentConformiteSocialeEntrepriseAction = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.conformiteSociale),
  ])
  .inputValidator(getAgentConformiteSocialeEntrepriseSchema)
  .handler(async ({ data }) => {
    const { siret, useCase } = data;
    return await getConformiteSocialeEntreprise(siret, { useCase });
  });

export const getAgentConformiteFiscaleEntrepriseAction = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.conformiteFiscale),
  ])
  .inputValidator(getAgentConformiteFiscaleEntrepriseSchema)
  .handler(async ({ data }) => {
    const { siret, useCase } = data;
    return await getConformiteFiscaleEntreprise(siret, { useCase });
  });

export const getAgentBilansProtectedAction = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.bilansBDF),
  ])
  .inputValidator(getAgentBilansProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, useCase } = data;
    return await getBilansProtected(siren, { useCase });
  });

export const getAgentChiffreAffairesProtectedAction = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.chiffreAffaires),
  ])
  .inputValidator(getAgentChiffreAffairesProtectedSchema)
  .handler(async ({ data }) => {
    const { siret, useCase } = data;
    return await getChiffreAffairesProtected(siret, { useCase });
  });

export const getAgentTravauxPublicsAction = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.travauxPublics),
  ])
  .inputValidator(getAgentTravauxPublicsSchema)
  .handler(async ({ data }) => {
    const { siret, useCase } = data;
    return await getTravauxPublic(siret, { useCase });
  });

export const getAgentLiassesFiscalesProtectedAction = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.liassesFiscales),
  ])
  .inputValidator(getAgentLiassesFiscalesProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, year, useCase } = data;
    return await getLiassesFiscalesProtected(siren, { year, useCase });
  });

export const getAgentLiensCapitalistiquesProtectedAction = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.liensCapitalistiques),
  ])
  .inputValidator(getAgentLiensCapitalistiquesProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, year, useCase } = data;
    return await getLiensCapitalistiquesProtected(siren, { year, useCase });
  });

export const getAgentAidesMinimisAction = createServerFn()
  .middleware([agentFnMiddleware, withRateLimiting])
  .inputValidator(getAgentAidesMinimisSchema)
  .handler(async ({ data }) => {
    const { siren, page } = data;
    return await clientMinimis(siren, page);
  });

/** Previous API routes */

export const getEspaceAgentOpqibi = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withApplicationRight(ApplicationRights.protectedCertificats),
  ])
  .inputValidator(getAgentOpqibiSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getOpqibi(siren);
  });

export const getEspaceAgentQualibat = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withApplicationRight(ApplicationRights.protectedCertificats),
  ])
  .inputValidator(getAgentQualibatSchema)
  .handler(async ({ data }) => {
    const { siret } = data;
    return await getQualibat(siret);
  });

export const getEspaceAgentQualifelec = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withApplicationRight(ApplicationRights.protectedCertificats),
  ])
  .inputValidator(getAgentQualifelecSchema)
  .handler(async ({ data }) => {
    const { siret } = data;
    return await getQualifelec(siret);
  });

export const getEspaceAgentDirigeantsProtected = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withApplicationRight(ApplicationRights.mandatairesRCS),
  ])
  .inputValidator(getAgentDirigeantsProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, isEI } = data;
    return await getDirigeantsProtected(siren, { isEI });
  });

export const getEspaceAgentBeneficiaires = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.beneficiaires),
  ])
  .inputValidator(getAgentBeneficiairesSchema)
  .handler(async ({ data }) => {
    const { siren, useCase } = data;
    return await getBeneficiaires(siren, { useCase });
  });

export const getEspaceAgentRneDocumentsAction = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withApplicationRight(ApplicationRights.documentsRne),
  ])
  .inputValidator(getAgentDocumentsRNEProtectedSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getDocumentsRNEProtected(siren);
  });

export const getEspaceAgentAssociationProtected = createServerFn()
  .middleware([
    agentFnMiddleware,
    withApplicationRight(ApplicationRights.associationProtected),
  ])
  .inputValidator(getAgentAssociationProtectedSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getAssociationProtected(siren);
  });

export const getEspaceAgentEffectifsAnnuelsProtected = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withApplicationRight(ApplicationRights.effectifs),
  ])
  .inputValidator(getAgentEffectifsAnnuelsProtectedSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getEffectifsAnnuelsProtected(siren);
  });

export const getEspaceAgentEffectifsMensuelsProtected = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withApplicationRight(ApplicationRights.effectifs),
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

export const getEspaceAgentBilansProtected = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.bilansBDF),
  ])
  .inputValidator(getAgentBilansProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, useCase } = data;
    return await getBilansProtected(siren, { useCase });
  });

export const getEspaceAgentChiffreAffairesProtected = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.chiffreAffaires),
  ])
  .inputValidator(getAgentChiffreAffairesProtectedSchema)
  .handler(async ({ data }) => {
    const { siret, useCase } = data;
    return await getChiffreAffairesProtected(siret, { useCase });
  });

export const getEspaceAgentTravauxPublics = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.travauxPublics),
  ])
  .inputValidator(getAgentTravauxPublicsSchema)
  .handler(async ({ data }) => {
    const { siret, useCase } = data;
    return await getTravauxPublic(siret, { useCase });
  });

export const getEspaceAgentLiassesFiscalesProtected = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.liassesFiscales),
  ])
  .inputValidator(getAgentLiassesFiscalesProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, year, useCase } = data;
    return await getLiassesFiscalesProtected(siren, { year, useCase });
  });

export const getEspaceAgentLiensCapitalistiquesProtected = createServerFn()
  .middleware([
    agentFnMiddleware,
    withRateLimiting,
    withUseCase,
    withApplicationRight(ApplicationRights.liensCapitalistiques),
  ])
  .inputValidator(getAgentLiensCapitalistiquesProtectedSchema)
  .handler(async ({ data }) => {
    const { siren, year, useCase } = data;
    return await getLiensCapitalistiquesProtected(siren, { year, useCase });
  });

export const getRneDirigeants = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(getAgentDirigeantsSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getDirigeantsRNE(siren, {});
  });

export const getRneObservations = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(getAgentObservationsSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getRNEObservations(siren, {});
  });

export const getAssociation = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(getAssociationSchema)
  .handler(async ({ data }) => {
    const { slug } = data;
    return await getAssociationFromSlug(slug, {});
  });

export const verifyTva = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(verifyTvaSchema)
  .handler(async ({ data }) => {
    const { slug } = data;
    return await buildAndVerifyTVA(slug, {});
  });

export const validateEORI = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(validateEORISchema)
  .handler(async ({ data }) => {
    const { siret } = data;
    return await getEORIValidation(siret, {});
  });

export const getSubventionsAssociation = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(getSubventionsAssociationSchema)
  .handler(async ({ data }) => {
    const { slug } = data;
    return await getSubventionsAssociationFromSlug(slug);
  });
