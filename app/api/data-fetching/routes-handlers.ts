import { getAssociationFromSlug } from "#models/association";
import { getEORIValidation } from "#models/eori-validation";
import { getDirigeantsRNE } from "#models/rne/dirigeants";
import { getRNEObservations } from "#models/rne/observations";
import { buildAndVerifyTVA } from "#models/tva/verify";
import { APIRoutesPaths } from "./routes-paths";

export const APIRoutesHandlers = {
  [APIRoutesPaths.RneDirigeants]: getDirigeantsRNE,
  [APIRoutesPaths.Observations]: getRNEObservations,
  [APIRoutesPaths.Association]: getAssociationFromSlug,
  [APIRoutesPaths.VerifyTva]: buildAndVerifyTVA,
  [APIRoutesPaths.EoriValidation]: getEORIValidation,
};
