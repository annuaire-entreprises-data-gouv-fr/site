"use server";

import { actionClient } from "server-actions/safe-action";
import { getAssociationFromSlug } from "#models/association";
import { getEORIValidation } from "#models/eori-validation";
import { getDirigeantsRNE } from "#models/rne/dirigeants";
import { getRNEObservations } from "#models/rne/observations";
import { buildAndVerifyTVA } from "#models/tva/verify";
import {
  getAssociationSchema,
  getEoriValidationSchema,
  getRneDirigeantsSchema,
  getRneObservationsSchema,
  verifyTvaSchema,
} from "./schemas";

export const getRneDirigeantsAction = actionClient
  .inputSchema(getRneDirigeantsSchema)
  .action(async ({ parsedInput }) => {
    const { siren } = parsedInput;
    return await getDirigeantsRNE(siren);
  });

export const getRneObservationsAction = actionClient
  .inputSchema(getRneObservationsSchema)
  .action(async ({ parsedInput }) => {
    const { siren } = parsedInput;
    return await getRNEObservations(siren);
  });

export const getAssociationAction = actionClient
  .inputSchema(getAssociationSchema)
  .action(async ({ parsedInput }) => {
    const { slug } = parsedInput;
    return await getAssociationFromSlug(slug);
  });

export const verifyTvaAction = actionClient
  .inputSchema(verifyTvaSchema)
  .action(async ({ parsedInput }) => {
    const { slug } = parsedInput;
    return await buildAndVerifyTVA(slug);
  });

export const getEoriValidationAction = actionClient
  .inputSchema(getEoriValidationSchema)
  .action(async ({ parsedInput }) => {
    const { siret } = parsedInput;
    return await getEORIValidation(siret);
  });
