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

export const validateEORISchema = z.object({
  siret: z.string().min(1, "Siret is required"),
});

export const getCollectiviteCommuneSchema = z.object({
  codeInsee: z.string().regex(/^(?:\d{5}|2[AB]\d{3})$/),
});

export const getCollectiviteEconomieLocaleSchema = getCollectiviteCommuneSchema;
