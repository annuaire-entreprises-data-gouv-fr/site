import { z } from "zod";
import { UseCase } from "#/models/use-cases";
import { TNatureEffectif } from "../../../clients/api-entreprise/effectifs/types";

export const getAgentBeneficiairesSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  useCase: z.enum(UseCase).optional(),
});

export const getAgentConformiteFiscaleEntrepriseSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  useCase: z.enum(UseCase).optional(),
});

export const getAgentConformiteSocialeEntrepriseSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  useCase: z.enum(UseCase).optional(),
});

export const getAgentBilansProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  useCase: z.enum(UseCase).optional(),
});

export const getAgentChiffreAffairesProtectedSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  useCase: z.enum(UseCase).optional(),
});

export const getAgentTravauxPublicsSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  useCase: z.enum(UseCase).optional(),
});

export const getAgentLiassesFiscalesProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  year: z.string().optional(),
  useCase: z.enum(UseCase).optional(),
});

export const getAgentLiensCapitalistiquesProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  year: z.string().optional(),
  useCase: z.enum(UseCase).optional(),
});

export const getAgentAidesMinimisSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  page: z.number().optional(),
});

export const getAgentOpqibiSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});

export const getAgentQualibatSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
});

export const getAgentQualifelecSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
});

export const getAgentDirigeantsProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  isEI: z.boolean(),
});

export const getAgentDocumentsRNEProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});

export const getAgentAssociationProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});

export const getAgentEffectifsAnnuelsProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});

export const getAgentEffectifsMensuelsProtectedSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  year: z.string(),
  useCase: z.enum(UseCase),
  natureEffectif: z.enum(TNatureEffectif),
});
