import { HttpUnauthorizedError } from '#clients/exceptions';
import routes from '#clients/routes';
import { droleApiClient } from './client';
import {
  IDRolesGroupSearchResponse,
  IDRolesRoles,
  IDRolesUser,
} from './interface';

/**
 * D-Roles
 * https://roles.preprod.data.gouv.fr/
 */
export const getGroupsByEmail = async (
  email: string
): Promise<IDRolesGroupSearchResponse> => {
  try {
    const route = routes.dRoles.groups.getGroupsByEmail(email);
    return await droleApiClient.get<IDRolesGroupSearchResponse>(route, {});
  } catch (error) {
    if (error instanceof HttpUnauthorizedError) {
      return [];
    }
    throw error;
  }
};

export const getRoles = async (): Promise<IDRolesRoles[]> => {
  const route = routes.dRoles.roles.getRoles();
  return await droleApiClient.get<IDRolesRoles[]>(route, {});
};

export const getUserByEmail = async (email: string): Promise<IDRolesUser> => {
  const route = routes.dRoles.users.getByEmail(email);
  return await droleApiClient.get<IDRolesUser>(route, {});
};

export const addUserToGroup = async (
  groupId: number,
  email: string,
  roleId: number
): Promise<null> => {
  const user = await droleApiClient.getUserByEmail(email);
  const route = routes.dRoles.groups.addUserToGroup(groupId, user.id, roleId);
  return await droleApiClient.get<null>(route, {
    method: 'PUT',
    data: { email },
  });
};

export const removeUserFromGroup = async (
  groupId: number,
  userId: number
): Promise<void> => {
  const route = routes.dRoles.groups.removeUserFromGroup(groupId, userId);

  await droleApiClient.get<null>(route, {
    method: 'DELETE',
  });
};
