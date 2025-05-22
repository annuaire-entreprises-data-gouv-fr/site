import droleClient from '#clients/api-d-roles';
import {
  IDRolesGroupSearchResponse,
  IDRolesRoles,
  IDRolesUser,
} from '#clients/api-d-roles/interface';
import { HttpUnauthorizedError } from '#clients/exceptions';
import { FetchRessourceException } from '#models/exceptions';
import { logFatalErrorInSentry } from '#utils/sentry';

export async function getGroupsByEmail(
  email: string
): Promise<IDRolesGroupSearchResponse> {
  try {
    return await droleClient.getGroupsByEmail(email);
  } catch (error) {
    logFatalErrorInSentry(
      new FetchRessourceException({
        ressource: 'D-Roles',
        cause: error,
      })
    );
    throw new HttpUnauthorizedError('Failed to get groups by email');
  }
}

export async function getRoles(): Promise<IDRolesRoles[]> {
  try {
    return await droleClient.getRoles();
  } catch (error) {
    logFatalErrorInSentry(
      new FetchRessourceException({
        ressource: 'D-Roles',
        cause: error,
      })
    );
    throw new HttpUnauthorizedError('Failed to get roles');
  }
}

export async function getUserByEmail(email: string): Promise<IDRolesUser> {
  try {
    return await droleClient.getUserByEmail(email);
  } catch (error) {
    logFatalErrorInSentry(
      new FetchRessourceException({
        ressource: 'D-Roles',
        cause: error,
      })
    );
    throw new HttpUnauthorizedError('Failed to get user by email');
  }
}

export async function addUserToGroup(
  groupId: number,
  email: string,
  roleId: number
): Promise<null> {
  try {
    return await droleClient.addUserToGroup(groupId, email, roleId);
  } catch (error) {
    logFatalErrorInSentry(
      new FetchRessourceException({
        ressource: 'D-Roles',
        cause: error,
      })
    );
    throw new HttpUnauthorizedError('Failed to add user to group');
  }
}

export async function removeUserFromGroup(
  groupId: number,
  userId: number
): Promise<void> {
  try {
    await droleClient.removeUserFromGroup(groupId, userId);
  } catch (error) {
    logFatalErrorInSentry(
      new FetchRessourceException({
        ressource: 'D-Roles',
        cause: error,
      })
    );
    throw new HttpUnauthorizedError('Failed to remove user from group');
  }
}
