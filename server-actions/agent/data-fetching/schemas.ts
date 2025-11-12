import { z } from "zod";
import { UseCase } from "#models/use-cases";

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
  isEI: z.boolean().optional(),
});

export const getAgentBeneficiairesSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
  useCase: z.nativeEnum(UseCase).optional(),
});

export const getAgentConformiteEntrepriseSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  useCase: z.nativeEnum(UseCase).optional(),
});

export const getAgentRNEDocumentsSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});

export const getAgentAssociationProtectedSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});
