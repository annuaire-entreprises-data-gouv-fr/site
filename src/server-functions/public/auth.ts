import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { getCurrentSession } from "#/utils/session";

export const getCurrentUserFn = createServerFn().handler(async () => {
  const session = await getCurrentSession();

  return session?.data.user || null;
});

export const agentAuthGuardFn = createServerFn()
  .inputValidator(
    z
      .object({
        onlySuperAgent: z.boolean().optional(),
      })
      .optional()
  )
  .handler(async ({ data }) => {
    const session = await getCurrentSession();

    if (
      !session.data.user ||
      !hasRights(session.data, ApplicationRights.isAgent)
    ) {
      throw redirect({ to: "/lp/agent-public" });
    }
    if (data?.onlySuperAgent && !session.data.user.isSuperAgent) {
      throw redirect({ to: "/compte/accueil" });
    }
  });
