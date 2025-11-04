"use server";

import { agentActionClient } from "server-actions/safe-action";
import { z } from "zod";
import {
  addUserToGroup,
  removeUserFromGroup,
} from "#models/authentication/group";

export const addUserToGroupAction = agentActionClient
  .inputSchema(
    z.object({
      groupId: z.number(),
      userEmail: z.string().email(),
      roleId: z.number(),
    })
  )
  .action(
    async ({ parsedInput }) =>
      await addUserToGroup(
        parsedInput.groupId,
        parsedInput.userEmail,
        parsedInput.roleId
      )
  );

export const removeUserFromGroupAction = agentActionClient
  .inputSchema(
    z.object({
      groupId: z.number(),
      userId: z.number(),
    })
  )
  .action(
    async ({ parsedInput }) =>
      await removeUserFromGroup(parsedInput.groupId, parsedInput.userId)
  );
