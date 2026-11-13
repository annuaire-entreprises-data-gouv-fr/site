import { createServerFn } from "@tanstack/react-start";
import { isAPINotResponding } from "#/models/api-not-responding";
import { getAssociationFromSlug } from "#/models/association";
import { ApplicationRights } from "#/models/authentication/user/rights";
import { anonymiseDirigeants } from "#/models/core/diffusion";
import { getEORIValidation } from "#/models/eori-validation";
import { getProtectedSiren } from "#/models/protected-siren";
import { getDirigeantsRNE } from "#/models/rne/dirigeants";
import { getRNEObservations } from "#/models/rne/observations";
import { verifySiren } from "#/utils/helpers";
import { withApplicationRight } from "../../middlewares";
import {
  getAssociationSchema,
  getDirigeantsSchema,
  getObservationsSchema,
  validateEORISchema,
} from "./schemas";

export const getRneDirigeantsFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .validator(getDirigeantsSchema)
  .handler(async ({ data }) => {
    const { siren } = data;

    const verifiedSiren = verifySiren(siren);

    const protectedSiren = await getProtectedSiren(verifiedSiren);
    const result = await getDirigeantsRNE(verifiedSiren, {});

    if (isAPINotResponding(result)) {
      return result;
    }

    return {
      ...result,
      data: anonymiseDirigeants(result.data, protectedSiren),
    };
  });

export const getRneObservationsFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .validator(getObservationsSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getRNEObservations(siren, {});
  });

export const getAssociationFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .validator(getAssociationSchema)
  .handler(async ({ data }) => {
    const { slug } = data;
    return await getAssociationFromSlug(slug, {});
  });

export const validateEORIFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .validator(validateEORISchema)
  .handler(async ({ data }) => {
    const { siret } = data;
    return await getEORIValidation(siret, {});
  });
