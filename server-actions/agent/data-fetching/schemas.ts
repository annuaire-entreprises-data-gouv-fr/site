import { z } from "zod";
import { UseCase } from "#models/use-cases";

export const getAgentBeneficiairesSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  useCase: z.nativeEnum(UseCase).optional(),
});

export const getAgentConformiteEntrepriseSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  useCase: z.nativeEnum(UseCase).optional(),
});

export const getAgentBilansProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  useCase: z.nativeEnum(UseCase).optional(),
});

export const getAgentChiffreAffairesProtectedSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  useCase: z.nativeEnum(UseCase).optional(),
});

export const getAgentTravauxPublicsSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  useCase: z.nativeEnum(UseCase).optional(),
});

export const getAgentLiassesFiscalesProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  year: z.string().optional(),
  useCase: z.nativeEnum(UseCase).optional(),
});

export const getAgentLiensCapitalistiquesProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  year: z.string().optional(),
  useCase: z.nativeEnum(UseCase).optional(),
});
