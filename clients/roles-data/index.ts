import routes from '#clients/routes';
import { IRolesDataGroup } from '#models/authentication/group/groups';
import { InternalError } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { rolesdataApiClient } from './client';
import {
  IRolesDataGroupResponse,
  IRolesDataRoles,
  IRolesDataUser,
} from './interface';
import { parseAgentScopes } from './parse';

/**
 * Roles.data
 * https://roles.data.gouv.fr/
 */
export const getGroupsByEmail = async (
  userEmail: string,
  userSub: string
): Promise<IRolesDataGroup[]> => {
  const route = routes.rolesData.groups.getGroupsByEmail(userEmail, userSub);
  const response = await rolesdataApiClient.fetch<IRolesDataGroupResponse[]>(
    route,
    {
      method: 'GET',
    }
  );
  return mapToDomainObject(response);
};

const mapToDomainObject = (
  response: IRolesDataGroupResponse[]
): IRolesDataGroup[] => {
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

export const getRolesMetadata = async (): Promise<IRolesDataRoles[]> => {
  const route = routes.rolesData.roles.get;
  return await rolesdataApiClient.fetch<IRolesDataRoles[]>(route, {
    method: 'GET',
  });
};

export const getUserByEmail = async (
  email: string
): Promise<IRolesDataUser> => {
  const route = routes.rolesData.users.getByEmail(email);
  return await rolesdataApiClient.fetch<IRolesDataUser>(route, {
    method: 'GET',
  });
};

export const updateName = async (
  groupId: number,
  groupName: string,
  actingUserSub: string
): Promise<null> => {
  const route = routes.rolesData.groups.updateName(
    groupId,
    groupName,
    actingUserSub
  );
  return await rolesdataApiClient.fetch<null>(route, {
    method: 'PUT',
  });
};

export const addUserToGroup = async (
  groupId: number,
  email: string,
  roleId: number,
  actingUserSub: string
): Promise<IRolesDataUser> => {
  const route = routes.rolesData.groups.addUserToGroup(groupId, actingUserSub);
  return await rolesdataApiClient.fetch<IRolesDataUser>(route, {
    method: 'POST',
    data: { email, role_id: roleId },
  });
};

export const updateUserFromGroup = async (
  groupId: number,
  email: string,
  roleId: number,
  actingUserSub: string
): Promise<IRolesDataUser> => {
  const user = await getUserByEmail(email);
  const route = routes.rolesData.groups.updateUserFromGroup(
    groupId,
    user.id,
    roleId,
    actingUserSub
  );
  return await rolesdataApiClient.fetch<IRolesDataUser>(route, {
    method: 'PATCH',
  });
};

export const removeUserFromGroup = async (
  groupId: number,
  userId: number,
  actingUserSub: string
): Promise<null> => {
  const route = routes.rolesData.groups.removeUserFromGroup(
    groupId,
    userId,
    actingUserSub
  );

  return await rolesdataApiClient.fetch<null>(route, {
    method: 'DELETE',
  });
};

export default {
  getGroupsByEmail,
  getRolesMetadata,
  getUserByEmail,
  updateName,
  addUserToGroup,
  updateUserFromGroup,
  removeUserFromGroup,
};
