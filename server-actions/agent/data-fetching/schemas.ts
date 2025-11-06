import { z } from "zod";
import { UseCase } from "#models/use-cases";

export const getAgentConformiteEntrepriseSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
  useCase: z.nativeEnum(UseCase).optional(),
});
