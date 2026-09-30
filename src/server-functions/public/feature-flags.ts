import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { FEATURE_FLAGS, isFeatureFlagEnabled } from "#/models/feature-flags";

export const getFeatureFlagFn = createServerFn()
  .validator(z.object({ featureFlag: z.enum(FEATURE_FLAGS) }))
  .handler(
    async ({ data: { featureFlag } }) => await isFeatureFlagEnabled(featureFlag)
  );
