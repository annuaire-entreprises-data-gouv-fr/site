import routes from '#clients/routes';
import { InternalError } from '#models/exceptions';
import { IDRolesGroup } from '#models/groups';
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
 * https://roles.preprod.data.gouv.fr/
 */
export const getGroupsByEmail = async (
  email: string
): Promise<IDRolesGroup[]> => {
  const route = routes.dRoles.groups.getGroupsByEmail(email);
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
  const route = routes.dRoles.roles.getRoles();
  return await droleApiClient.fetch<IDRolesRoles[]>(route, { method: 'GET' });
};

export const getUserByEmail = async (email: string): Promise<IDRolesUser> => {
  const route = routes.dRoles.users.getByEmail(email);
  return await droleApiClient.fetch<IDRolesUser>(route, {
    method: 'GET',
  });
};

export const addUserToGroup = async (
  groupId: number,
  email: string,
  roleId: number
): Promise<null> => {
  const user = await getUserByEmail(email);
  const route = routes.dRoles.groups.addUserToGroup(groupId, user.id, roleId);
  return await droleApiClient.fetch<null>(route, {
    method: 'PUT',
    data: { email },
  });
};

export const removeUserFromGroup = async (
  groupId: number,
  userId: number
): Promise<null> => {
  const route = routes.dRoles.groups.removeUserFromGroup(groupId, userId);

  return await droleApiClient.fetch<null>(route, {
    method: 'DELETE',
  });
};

export default {
  getGroupsByEmail,
  getRoles,
  getUserByEmail,
  addUserToGroup,
  removeUserFromGroup,
};
