import { z } from "zod";

export const getDirigeantsSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});

export const getObservationsSchema = z.object({
  siren: z.string().min(1, "Siren is required"),
});

export const getAssociationSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const verifyTvaSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const validateEORISchema = z.object({
  siret: z.string().min(1, "Siret is required"),
});

export const getSubventionsAssociationSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});