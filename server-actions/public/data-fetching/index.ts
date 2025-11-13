"use server";

import { actionClient } from "server-actions/safe-action";
import { getEORIValidation } from "#models/eori-validation";
import { buildAndVerifyTVA } from "#models/tva/verify";
import { getEoriValidationSchema, verifyTvaSchema } from "./schemas";

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
