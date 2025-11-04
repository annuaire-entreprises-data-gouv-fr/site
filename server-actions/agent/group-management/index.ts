"use server";

import { agentActionClient } from "server-actions/safe-action";
import {
  addUserToGroup,
  removeUserFromGroup,
  updateGroupName,
} from "#models/authentication/group";
import {
  addUserToGroupSchema,
  removeUserFromGroupSchema,
  updateGroupNameSchema,
} from "./schemas";

export const addUserToGroupAction = agentActionClient
  .inputSchema(addUserToGroupSchema)
  .action(
    async ({ parsedInput }) =>
      await addUserToGroup(
        parsedInput.groupId,
        parsedInput.userEmail,
        parsedInput.roleId
      )
  );

export const removeUserFromGroupAction = agentActionClient
  .inputSchema(removeUserFromGroupSchema)
  .action(
    async ({ parsedInput }) =>
      await removeUserFromGroup(parsedInput.groupId, parsedInput.userId)
  );

export const updateGroupNameAction = agentActionClient
  .inputSchema(updateGroupNameSchema)
  .action(
    async ({ parsedInput }) =>
      await updateGroupName(parsedInput.groupId, parsedInput.groupName)
  );
