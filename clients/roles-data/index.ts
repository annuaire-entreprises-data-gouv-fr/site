import routes from '#clients/routes';
import { IDRolesGroup } from '#models/authentication/group/groups';
import { InternalError } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { droleApiClient } from './client';
import {
  IDRolesGroupSearchResponse,
  IDRolesRoles,
  IDRolesUser,
} from './interface';
import { parseAgentScopes } from './parse';

/**
 * D-Roles
 * https://roles.data.gouv.fr/
 */
export const getGroupsByEmail = async (
  userEmail: string,
  userSub: string
): Promise<IDRolesGroup[]> => {
  const route = routes.dRoles.groups.getGroupsByEmail(userEmail, userSub);
  const response = await droleApiClient.fetch<IDRolesGroupSearchResponse>(
    route,
    {
      method: 'GET',
    }
  );
  return mapToDomainObject(response);
};

const mapToDomainObject = (
  response: IDRolesGroupSearchResponse
): IDRolesGroup[] => {
  return response.map((group) => {
    const { inValidScopes, validScopes } = parseAgentScopes(group.scopes);
    if (inValidScopes.length > 0) {
      logErrorInSentry(
        new InternalError({
          message: `Unknown agent scopes : ${inValidScopes.join(',')}`,
        })
      );
    }
    return {
      ...group,
      scopes: validScopes,
    };
  });
};

export const getRoles = async (): Promise<IDRolesRoles[]> => {
  const route = routes.dRoles.roles.get;
  return await droleApiClient.fetch<IDRolesRoles[]>(route, { method: 'GET' });
};

export const getUserByEmail = async (email: string): Promise<IDRolesUser> => {
  const route = routes.dRoles.users.getByEmail(email);
  return await droleApiClient.fetch<IDRolesUser>(route, {
    method: 'GET',
  });
};

export const updateName = async (
  groupId: number,
  groupName: string,
  actingUserSub: string
): Promise<null> => {
  const route = routes.dRoles.groups.updateName(
    groupId,
    groupName,
    actingUserSub
  );
  return await droleApiClient.fetch<null>(route, {
    method: 'PUT',
  });
};
export const addUserToGroup = async (
  groupId: number,
  email: string,
  roleId: number,
  actingUserSub: string
): Promise<IDRolesUser> => {
  const route = routes.dRoles.groups.addUserToGroup(groupId, actingUserSub);
  return await droleApiClient.fetch<IDRolesUser>(route, {
    method: 'POST',
    data: { email, role_id: roleId },
  });
};

export const updateUserFromGroup = async (
  groupId: number,
  email: string,
  roleId: number,
  actingUserSub: string
): Promise<IDRolesUser> => {
  const user = await getUserByEmail(email);
  const route = routes.dRoles.groups.updateUserFromGroup(
    groupId,
    user.id,
    roleId,
    actingUserSub
  );
  return await droleApiClient.fetch<IDRolesUser>(route, {
    method: 'PATCH',
  });
};

export const removeUserFromGroup = async (
  groupId: number,
  userId: number,
  actingUserSub: string
): Promise<null> => {
  const route = routes.dRoles.groups.removeUserFromGroup(
    groupId,
    userId,
    actingUserSub
  );

  return await droleApiClient.fetch<null>(route, {
    method: 'DELETE',
  });
};

export default {
  getGroupsByEmail,
  getRoles,
  getUserByEmail,
  updateName,
  addUserToGroup,
  updateUserFromGroup,
  removeUserFromGroup,
};
