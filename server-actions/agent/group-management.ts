"use server";

import { agentActionClient } from "server-actions/safe-action";
import { z } from "zod";
import { removeUserFromGroup } from "#models/authentication/group";

export const removeUserFromGroupAction = agentActionClient
  .inputSchema(
    z.object({
      groupId: z.number(),
      userId: z.number(),
    })
  )
  .outputSchema(z.void())
  .action(async ({ parsedInput }) => {
    await removeUserFromGroup(parsedInput.groupId, parsedInput.userId);
  });
