import { createServerFn } from "@tanstack/react-start";
import { clientRolesGetOrganizationsGroups } from "#/clients/roles-data";
import {
  addUserToGroup,
  removeUserFromGroup,
  updateGroupName,
  updateUserRoleInGroup,
} from "#/models/authentication/group";
import { agentFnMiddleware } from "#/server-functions/middlewares";
import {
  addUserToGroupSchema,
  removeUserFromGroupSchema,
  updateGroupNameSchema,
  updateUserRoleInGroupSchema,
} from "./schemas";

export const addUserToGroupAction = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .inputValidator(addUserToGroupSchema)
  .handler(async ({ data }) => {
    const { groupId, userEmail, roleId } = data;
    return await addUserToGroup(groupId, userEmail, roleId);
  });

export const removeUserFromGroupAction = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .inputValidator(removeUserFromGroupSchema)
  .handler(async ({ data }) => {
    const { groupId, userId } = data;
    return await removeUserFromGroup(groupId, userId);
  });

export const updateGroupNameAction = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .inputValidator(updateGroupNameSchema)
  .handler(async ({ data }) => {
    const { groupId, groupName } = data;
    return await updateGroupName(groupId, groupName);
  });

export const updateUserRoleInGroupAction = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .inputValidator(updateUserRoleInGroupSchema)
  .handler(async ({ data }) => {
    const { groupId, userId, roleId } = data;
    return await updateUserRoleInGroup(groupId, userId, roleId);
  });

export const getOrganizationsGroupsAction = createServerFn()
  .middleware([agentFnMiddleware])
  .handler(async () => await clientRolesGetOrganizationsGroups());
