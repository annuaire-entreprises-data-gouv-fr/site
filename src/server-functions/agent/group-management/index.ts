import { createServerFn } from "@tanstack/react-start";
import {
  HttpBadRequestError,
  HttpConflict,
  HttpNotFound,
} from "#/clients/exceptions";
import { clientRolesGetOrganizationsGroups } from "#/clients/roles-data/index.server";
import {
  addUsersToGroup,
  addUserToGroup,
  getAgentGroup,
  getAgentGroups,
  removeUserFromGroup,
  updateGroupName,
  updateUserRoleInGroup,
} from "#/models/authentication/group";
import { rolesMetadataStore } from "#/models/authentication/group/roles";
import { agentFnMiddleware } from "#/server-functions/middlewares";
import {
  addUsersToGroupSchema,
  addUserToGroupSchema,
  getAgentGroupSchema,
  removeUserFromGroupSchema,
  updateGroupNameSchema,
  updateUserRoleInGroupSchema,
} from "./schemas";

export const addUserToGroupFn = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .validator(addUserToGroupSchema)
  .handler(async ({ data }) => {
    const { groupId, userEmail, roleId } = data;
    try {
      return await addUserToGroup(groupId, userEmail, roleId);
    } catch (error) {
      if (error instanceof HttpConflict) {
        return { error: "USER_ALREADY_IN_GROUP" as const };
      }
      throw error;
    }
  });

// The batch endpoint is all-or-nothing: on any error, no user has been added
export const addUsersToGroupFn = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .validator(addUsersToGroupSchema)
  .handler(async ({ data }) => {
    const { groupId, userEmails, roleId } = data;
    try {
      return await addUsersToGroup(groupId, userEmails, roleId);
    } catch (error) {
      if (error instanceof HttpConflict) {
        return { error: "USER_ALREADY_IN_GROUP" as const };
      }
      if (error instanceof HttpBadRequestError) {
        return { error: "DUPLICATE_EMAILS" as const };
      }
      if (error instanceof HttpNotFound) {
        return { error: "GROUP_OR_ROLE_NOT_FOUND" as const };
      }
      throw error;
    }
  });

export const removeUserFromGroupFn = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .validator(removeUserFromGroupSchema)
  .handler(async ({ data }) => {
    const { groupId, userId } = data;
    return await removeUserFromGroup(groupId, userId);
  });

export const updateGroupNameFn = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .validator(updateGroupNameSchema)
  .handler(async ({ data }) => {
    const { groupId, groupName } = data;
    return await updateGroupName(groupId, groupName);
  });

export const updateUserRoleInGroupFn = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .validator(updateUserRoleInGroupSchema)
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

export const getAgentGroupFn = createServerFn()
  .middleware([agentFnMiddleware])
  .validator(getAgentGroupSchema)
  .handler(
    async ({ data }) =>
      await getAgentGroup(data.groupId, data.usersPage, data.usersSearch)
  );

export const getAgentRolesFn = createServerFn()
  .middleware([agentFnMiddleware])
  .handler(async () => rolesMetadataStore.getRoles());
