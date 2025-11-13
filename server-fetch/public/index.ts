import { getAssociationFromSlug } from "#models/association";
import { getEORIValidation } from "#models/eori-validation";
import { getDirigeantsRNE } from "#models/rne/dirigeants";
import { getRNEObservations } from "#models/rne/observations";
import { buildAndVerifyTVA } from "#models/tva/verify";
import { withErrorHandler } from "#utils/server-side-helper/with-error-handler";

export const getRNEObservationsFetcher = withErrorHandler((siren) =>
  getRNEObservations(siren)
);

export const getDirigeantsRNEFetcher = withErrorHandler((siren) =>
  getDirigeantsRNE(siren)
);

export const getAssociationFromSlugFetcher = withErrorHandler((siren) =>
  getAssociationFromSlug(siren)
);

export const getEORIValidationFetcher = withErrorHandler((siret) =>
  getEORIValidation(siret)
);

export const buildAndVerifyTVAFetcher = withErrorHandler((siren) =>
  buildAndVerifyTVA(siren)
);
