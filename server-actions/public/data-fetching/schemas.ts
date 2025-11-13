import { z } from "zod";

export const verifyTvaSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const getEoriValidationSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
});
