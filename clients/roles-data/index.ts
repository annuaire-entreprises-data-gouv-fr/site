import { rolesDataResourceServerClient } from "#clients/authentication/pro-connect/resource-server-client";
import routes from "#clients/routes";
import type {
  IAgentsGroup,
  IAgentsOrganizationGroup,
} from "#models/authentication/group";
import { InternalError } from "#models/exceptions";
import { httpGet } from "#utils/network";
import logErrorInSentry from "#utils/sentry";
import type {
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
export const clientRolesGetGroups = async (): Promise<IAgentsGroup[]> => {
  const url = process.env.ROLES_DATA_URL + routes.rolesData.groups.getGroups;
  const response = await rolesDataResourceServerClient<IAgentsGroupResponse[]>({
    url,
    method: "GET",
  });

  return mapToDomainObject(response);
};

const mapToDomainObject = (response: IAgentsGroupResponse[]): IAgentsGroup[] =>
  response.map((group) => {
    const { inValidScopes, validScopes } = parseAgentScopes(group.scopes);

    if (inValidScopes.length > 0) {
      logErrorInSentry(
        new InternalError({
          message: `Unknown agent scopes : ${inValidScopes.join(",")}`,
        })
      );
    }
    return {
      ...group,
      scopes: validScopes,
    };
  });

export const clientRolesGetOrganizationsGroups = async (): Promise<
  IAgentsOrganizationGroup[]
> => {
  const url =
    process.env.ROLES_DATA_URL + routes.rolesData.organizations.getGroups;
  const response = await rolesDataResourceServerClient<
    IAgentsOrganizationGroupResponse[]
  >({
    url,
    method: "GET",
  });

  return mapToDomainObjectOrganizationGroups(response);
};

const mapToDomainObjectOrganizationGroups = (
  response: IAgentsOrganizationGroupResponse[]
): IAgentsOrganizationGroup[] =>
  response.map((group) => {
    const { inValidScopes, validScopes } = parseAgentScopes(group.scopes);

    if (inValidScopes.length > 0) {
      logErrorInSentry(
        new InternalError({
          message: `Unknown agent scopes : ${inValidScopes.join(",")}`,
        })
      );
    }

    return {
      id: group.id,
      name: group.name,
      adminEmails: group.admin_emails,
      scopes: validScopes,
    };
  });

export const clientRolesGetMetadata = async (): Promise<IRolesDataRoles[]> => {
  const url = process.env.ROLES_DATA_URL + routes.rolesData.roles.get;
  return await httpGet<IRolesDataRoles[]>(url);
};

export const clientRolesUpdateName = async (
  groupId: number,
  groupName: string
): Promise<void> => {
  const route =
    process.env.ROLES_DATA_URL +
    routes.rolesData.groups.updateName(groupId, groupName);
  return await rolesDataResourceServerClient<void>({
    url: route,
    method: "PUT",
  });
};

export const clientRolesAddUserToGroup = async (
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
};

export const clientRolesUpdateUserFromGroup = async (
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
};

export const clientRolesRemoveUserFromGroup = async (
  groupId: number,
  userId: number
): Promise<void> => {
  const url =
    process.env.ROLES_DATA_URL +
    routes.rolesData.groups.removeUserFromGroup(groupId, userId);

  return await rolesDataResourceServerClient<void>({
    url,
    method: "DELETE",
  });
};
