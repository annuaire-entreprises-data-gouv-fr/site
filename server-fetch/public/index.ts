import { getAssociationFromSlug } from "#models/association";
import { getEORIValidation } from "#models/eori-validation";
import { getDirigeantsRNE } from "#models/rne/dirigeants";
import { getRNEObservations } from "#models/rne/observations";
import { buildAndVerifyTVA } from "#models/tva/verify";
import { withErrorHandler } from "../middlewares";

export const getRNEObservationsFetcher = withErrorHandler(getRNEObservations);

export const getDirigeantsRNEFetcher = withErrorHandler(getDirigeantsRNE);

export const getAssociationFromSlugFetcher = withErrorHandler(
  getAssociationFromSlug
);

export const getEORIValidationFetcher = withErrorHandler(getEORIValidation);

export const buildAndVerifyTVAFetcher = withErrorHandler(buildAndVerifyTVA);
