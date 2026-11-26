import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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
import { isFeatureFlagEnabled } from "#/models/feature-flags";
import { agentFnMiddleware } from "#/server-functions/middlewares";
import {
  addUsersToGroupSchema,
  addUserToGroupSchema,
  getAgentGroupSchema,
  removeUserFromGroupSchema,
  updateGroupNameSchema,
  updateUserRoleInGroupSchema,
} from "./schemas";

const personalEmailRefusedSchema = z.object({
  detail: z.object({
    code: z.literal("PERSONAL_EMAIL_REFUSED"),
    emails: z.array(z.string()),
  }),
});

const toPersonalEmailRefusal = (error: unknown) => {
  if (!(error instanceof HttpBadRequestError)) {
    return null;
  }
  const refusal = personalEmailRefusedSchema.safeParse(error.data);
  if (!refusal.success) {
    return null;
  }
  const { detail } = refusal.data;
  return {
    error: "PERSONAL_EMAIL_REFUSED" as const,
    emails: detail.emails,
  };
};

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
      const personalEmailRefusal = toPersonalEmailRefusal(error);
      if (personalEmailRefusal) {
        return personalEmailRefusal;
      }
      throw error;
    }
  });

// roles.data names the users already in the group in its 409 response
const usersAlreadyInGroupSchema = z.object({
  detail: z.object({
    code: z.literal("USERS_ALREADY_IN_GROUP"),
    emails: z.array(z.string()),
  }),
});

const BATCH_SIZE_ALERT = 20;

// The batch endpoint is all-or-nothing: on any error, no user has been added
export const addUsersToGroupFn = createServerFn({ method: "POST" })
  .middleware([agentFnMiddleware])
  .validator(addUsersToGroupSchema)
  .handler(async ({ data }) => {
    if (!(await isFeatureFlagEnabled("group_users_batch_add_enabled"))) {
      return { error: "FEATURE_DISABLED" as const };
    }
    const { groupId, userEmails, roleId } = data;

    if (userEmails.length > BATCH_SIZE_ALERT) {
      console.warn(
        `[roles-data-batch] Batch size alert: ${userEmails.length} emails for group ${groupId}`
      );
    }

    try {
      return await addUsersToGroup(groupId, userEmails, roleId);
    } catch (error) {
      if (error instanceof HttpConflict) {
        const conflict = usersAlreadyInGroupSchema.safeParse(error.data);
        return {
          error: "USER_ALREADY_IN_GROUP" as const,
          // empty when roles.data does not name them
          emails: conflict.success ? conflict.data.detail.emails : [],
        };
      }
      const personalEmailRefusal = toPersonalEmailRefusal(error);
      if (personalEmailRefusal) {
        return personalEmailRefusal;
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
