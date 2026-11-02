import { createServerOnlyFn } from "@tanstack/react-start";
import { rolesDataResourceServerClient } from "#/clients/authentication/pro-connect/resource-server-client.server";
import routes from "#/clients/routes";
import type {
  IAgentsGroup,
  IAgentsGroupDetails,
  IAgentsOrganizationGroup,
} from "#/models/authentication/group";
import { InternalError } from "#/models/exceptions";
import { httpGet } from "#/utils/network";
import { logErrorInSentry } from "#/utils/sentry";
import type {
  IAgentsGroupDetailsResponse,
  IAgentsGroupResponse,
  IAgentsOrganizationGroupResponse,
  IRolesDataRoles,
  IRolesDataUser,
} from "./interface";
import { parseAgentScopes } from "./parse";

/**
 * Roles.data
 * https://roles.data.gouv.fr/
 */
export const clientRolesGetGroups = createServerOnlyFn(
  async (): Promise<IAgentsGroup[]> => {
    const url = process.env.ROLES_DATA_URL + routes.rolesData.groups.getGroups;
    const response = await rolesDataResourceServerClient<
      IAgentsGroupResponse[]
    >({
      url,
      method: "GET",
    });

    return mapToDomainObject(response);
  }
);

const parseGroupScopes = (scopes: string) => {
  const { inValidScopes, validScopes } = parseAgentScopes(scopes);

  if (inValidScopes.length > 0) {
    logErrorInSentry(
      new InternalError({
        message: `Unknown agent scopes : ${inValidScopes.join(",")}`,
      })
    );
  }
  return validScopes;
};

const mapToDomainObject = (response: IAgentsGroupResponse[]): IAgentsGroup[] =>
  response.map((group) => ({
    ...group,
    scopes: parseGroupScopes(group.scopes),
  }));

export const clientRolesGetGroup = createServerOnlyFn(
  async (
    groupId: number,
    usersPage: number,
    usersSize: number,
    // filters users on their email, case-insensitively
    usersSearch?: string
  ): Promise<IAgentsGroupDetails> => {
    const url =
      process.env.ROLES_DATA_URL +
      routes.rolesData.groups.getGroup(
        groupId,
        usersPage,
        usersSize,
        usersSearch
      );
    const response =
      await rolesDataResourceServerClient<IAgentsGroupDetailsResponse>({
        url,
        method: "GET",
      });

    const { users_pagination, ...group } = response;
    return {
      ...group,
      scopes: parseGroupScopes(group.scopes),
      usersPagination: {
        page: users_pagination.page,
        size: users_pagination.size,
        total: users_pagination.total,
        totalPages: users_pagination.total_pages,
      },
    };
  }
);

export const clientRolesGetOrganizationsGroups = createServerOnlyFn(
  async (): Promise<IAgentsOrganizationGroup[]> => {
    const url =
      process.env.ROLES_DATA_URL + routes.rolesData.organizations.getGroups;
    const response = await rolesDataResourceServerClient<
      IAgentsOrganizationGroupResponse[]
    >({
      url,
      method: "GET",
    });

    return mapToDomainObjectOrganizationGroups(response);
  }
);

const mapToDomainObjectOrganizationGroups = (
  response: IAgentsOrganizationGroupResponse[]
): IAgentsOrganizationGroup[] =>
  response.map((group) => ({
    id: group.id,
    name: group.name,
    adminEmails: group.admin_emails,
    scopes: parseGroupScopes(group.scopes),
  }));

export const clientRolesGetMetadata = createServerOnlyFn(
  async (): Promise<IRolesDataRoles[]> => {
    const url = process.env.ROLES_DATA_URL + routes.rolesData.roles.get;
    return await httpGet<IRolesDataRoles[]>(url);
  }
);

export const clientRolesUpdateName = createServerOnlyFn(
  async (groupId: number, groupName: string): Promise<void> => {
    const route =
      process.env.ROLES_DATA_URL +
      routes.rolesData.groups.updateName(groupId, groupName);
    return await rolesDataResourceServerClient<void>({
      url: route,
      method: "PUT",
    });
  }
);

export const clientRolesAddUserToGroup = createServerOnlyFn(
  async (
    groupId: number,
    email: string,
    roleId: number
  ): Promise<IRolesDataUser> => {
    const url =
      process.env.ROLES_DATA_URL +
      routes.rolesData.groups.addUserToGroup(groupId);
    return await rolesDataResourceServerClient<IRolesDataUser>({
      url,
      method: "POST",
      data: { email, role_id: roleId },
    });
  }
);

export const clientRolesAddUsersToGroupBatch = createServerOnlyFn(
  async (
    groupId: number,
    emails: string[],
    roleId: number
  ): Promise<IRolesDataUser[]> => {
    const url =
      process.env.ROLES_DATA_URL +
      routes.rolesData.groups.addUsersToGroupBatch(groupId);
    return await rolesDataResourceServerClient<IRolesDataUser[]>({
      url,
      method: "POST",
      data: { users: emails.map((email) => ({ email, role_id: roleId })) },
    });
  }
);

export const clientRolesUpdateUserFromGroup = createServerOnlyFn(
  async (
    groupId: number,
    userId: number,
    roleId: number
  ): Promise<IRolesDataUser> => {
    const url =
      process.env.ROLES_DATA_URL +
      routes.rolesData.groups.updateUserFromGroup(groupId, userId, roleId);

    return await rolesDataResourceServerClient<IRolesDataUser>({
      url,
      method: "PATCH",
    });
  }
);

export const clientRolesRemoveUserFromGroup = createServerOnlyFn(
  async (groupId: number, userId: number): Promise<void> => {
    const url =
      process.env.ROLES_DATA_URL +
      routes.rolesData.groups.removeUserFromGroup(groupId, userId);

    return await rolesDataResourceServerClient<void>({
      url,
      method: "DELETE",
    });
  }
);
