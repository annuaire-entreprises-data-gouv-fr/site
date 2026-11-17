import { createServerFn } from "@tanstack/react-start";
import { HttpNotFound } from "#/clients/exceptions";
import { isAPINotResponding } from "#/models/api-not-responding";
import { getAssociationFromSlug } from "#/models/association";
import { ApplicationRights } from "#/models/authentication/user/rights";
import { anonymiseDirigeants } from "#/models/core/diffusion";
import { getEORIValidation } from "#/models/eori-validation";
import { getProtectedSiren } from "#/models/protected-siren";
import { getDirigeantsRNE } from "#/models/rne/dirigeants";
import { getRNEObservations } from "#/models/rne/observations";
import { verifySiren } from "#/utils/helpers";
import getSession from "#/utils/server-side-helper/get-session";
import { withApplicationRight } from "../../middlewares";
import { getUniteLegaleFromSirenFn } from "../unite-legale";
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

    const [protectedSiren, result, uniteLegale, session] = await Promise.all([
      getProtectedSiren(verifiedSiren),
      getDirigeantsRNE(verifiedSiren, {}),
      getUniteLegaleFromSirenFn({ data: { siren: verifiedSiren } }),
      getSession(),
    ]);

    if (isAPINotResponding(result)) {
      return result;
    }

    if (!uniteLegale) {
      throw new HttpNotFound("Unite legale not found");
    }

    return {
      ...result,
      data: anonymiseDirigeants(
        uniteLegale,
        session,
        result.data,
        protectedSiren
      ),
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
