import { createServerFn } from "@tanstack/react-start";
import { getAssociationFromSlug } from "#/models/association";
import { ApplicationRights } from "#/models/authentication/user/rights";
import { getEORIValidation } from "#/models/eori-validation";
import { getDirigeantsRNE } from "#/models/rne/dirigeants";
import { getRNEObservations } from "#/models/rne/observations";
import { withApplicationRight } from "../../middlewares";
import {
  getAssociationSchema,
  getDirigeantsSchema,
  getObservationsSchema,
  validateEORISchema,
} from "./schemas";

export const getRneDirigeantsFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(getDirigeantsSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getDirigeantsRNE(siren, {});
  });

export const getRneObservationsFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(getObservationsSchema)
  .handler(async ({ data }) => {
    const { siren } = data;
    return await getRNEObservations(siren, {});
  });

export const getAssociationFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(getAssociationSchema)
  .handler(async ({ data }) => {
    const { slug } = data;
    return await getAssociationFromSlug(slug, {});
  });

export const validateEORIFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(validateEORISchema)
  .handler(async ({ data }) => {
    const { siret } = data;
    return await getEORIValidation(siret, {});
  });
