import { z } from "zod";

export const getRneDirigeantsSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});

export const getRneObservationsSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});

export const getAssociationSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const verifyTvaSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const getEoriValidationSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
});
