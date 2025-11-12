import { z } from "zod";
import { UseCase } from "#models/use-cases";

export const getAgentOpqibiSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});

export const getAgentQualibatSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
});

export const getAgentConformiteEntrepriseSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  useCase: z.nativeEnum(UseCase).optional(),
});
