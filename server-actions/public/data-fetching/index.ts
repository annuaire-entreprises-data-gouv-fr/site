"use server";

import { actionClient } from "server-actions/safe-action";
import { getEORIValidation } from "#models/eori-validation";
import { getEoriValidationSchema } from "./schemas";

export const getEoriValidationAction = actionClient
  .inputSchema(getEoriValidationSchema)
  .action(async ({ parsedInput }) => {
    const { siret } = parsedInput;
    return await getEORIValidation(siret);
  });
