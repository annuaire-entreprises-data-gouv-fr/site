import { getAssociationFromSlug } from "#models/association";
import { getEORIValidation } from "#models/eori-validation";
import { getDirigeantsRNE } from "#models/rne/dirigeants";
import { getRNEObservations } from "#models/rne/observations";
import { buildAndVerifyTVA } from "#models/tva/verify";
import { createPublicFetcher } from "./middlewares";

export const getRNEObservationsFetcher =
  createPublicFetcher(getRNEObservations).build();

export const getDirigeantsRNEFetcher =
  createPublicFetcher(getDirigeantsRNE).build();

export const getAssociationFromSlugFetcher = createPublicFetcher(
  getAssociationFromSlug
).build();

export const getEORIValidationFetcher =
  createPublicFetcher(getEORIValidation).build();

export const buildAndVerifyTVAFetcher =
  createPublicFetcher(buildAndVerifyTVA).build();
