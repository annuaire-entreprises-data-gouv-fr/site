import { createServerFn } from "@tanstack/react-start";
import { clientRolesGetOrganizationsGroups } from "#/clients/roles-data/index.server";
import {
  addUserToGroup,
  getAgentGroups,
  removeUserFromGroup,
  updateGroupName,
  updateUserRoleInGroup,
} from "#/models/authentication/group";
import { rolesMetadataStore } from "#/models/authentication/group/roles";
import { agentFnMiddleware } from "#/server-functions/middlewares";
import {
  addUserToGroupSchema,
  removeUserFromGroupSchema,
  updateGroupNameSchema,
  updateUserRoleInGroupSchema,
} from "./schemas";

export const addUserToGroupFn = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .inputValidator(addUserToGroupSchema)
  .handler(async ({ data }) => {
    const { groupId, userEmail, roleId } = data;
    return await addUserToGroup(groupId, userEmail, roleId);
  });

export const removeUserFromGroupFn = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .inputValidator(removeUserFromGroupSchema)
  .handler(async ({ data }) => {
    const { groupId, userId } = data;
    return await removeUserFromGroup(groupId, userId);
  });

export const updateGroupNameFn = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .inputValidator(updateGroupNameSchema)
  .handler(async ({ data }) => {
    const { groupId, groupName } = data;
    return await updateGroupName(groupId, groupName);
  });

export const updateUserRoleInGroupFn = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .inputValidator(updateUserRoleInGroupSchema)
  .handler(async ({ data }) => {
    const { groupId, userId, roleId } = data;
    return await updateUserRoleInGroup(groupId, userId, roleId);
  });

export const getOrganizationsGroupsFn = createServerFn()
  .middleware([agentFnMiddleware])
  .handler(async () => await clientRolesGetOrganizationsGroups());

export const getAgentGroupsFn = createServerFn()
  .middleware([agentFnMiddleware])
  .handler(
    async () => await getAgentGroups({ allowProConnectRedirection: true })
  );

export const getAgentRolesFn = createServerFn()
  .middleware([agentFnMiddleware])
  .handler(async () => rolesMetadataStore.getRoles());
