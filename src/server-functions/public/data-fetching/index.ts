import { createServerFn } from "@tanstack/react-start";
import { getAssociationFromSlug } from "#/models/association";
import { ApplicationRights } from "#/models/authentication/user/rights";
import { getEORIValidation } from "#/models/eori-validation";
import { getDirigeantsRNE } from "#/models/rne/dirigeants";
import { getRNEObservations } from "#/models/rne/observations";
import { getSubventionsAssociationFromSlug } from "#/models/subventions/association";
import { buildAndVerifyTVA } from "#/models/tva/verify";
import { withApplicationRight } from "../../middlewares";
import {
  getAssociationSchema,
  getDirigeantsSchema,
  getObservationsSchema,
  getSubventionsAssociationSchema,
  validateEORISchema,
  verifyTvaSchema,
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

export const verifyTvaFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(verifyTvaSchema)
  .handler(async ({ data }) => {
    const { slug } = data;
    return await buildAndVerifyTVA(slug, {});
  });

export const validateEORIFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(validateEORISchema)
  .handler(async ({ data }) => {
    const { siret } = data;
    return await getEORIValidation(siret, {});
  });

export const getSubventionsAssociationFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .inputValidator(getSubventionsAssociationSchema)
  .handler(async ({ data }) => {
    const { slug } = data;
    return await getSubventionsAssociationFromSlug(slug);
  });
