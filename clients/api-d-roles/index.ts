import { HttpNotFound, HttpUnauthorizedError } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { httpClient } from '#utils/network';
import {
  IDRolesAuthTokenResponse,
  IDRolesGroupSearchResponse,
} from './interface';

/**
 * D-Roles
 * https://roles.preprod.data.gouv.fr/
 */

/**
 * Authenticate with client_id and client_secret to get a token
 * @param client_id Client ID
 * @param client_secret Client secret
 * @param grant_type Grant type
 * @returns Authentication token
 */
export const getAccessToken = async (): Promise<string> => {
  try {
    const route = routes.dRoles.auth.token;
    const data = await httpClient<IDRolesAuthTokenResponse>({
      url: route,
      method: 'POST',
      timeout: constants.timeout.XXXL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: new URLSearchParams({
        client_id: process.env.D_ROLES_CLIENT_ID!,
        client_secret: process.env.D_ROLES_CLIENT_SECRET!,
        grant_type: 'client_credentials',
      }).toString(),
    });

    if (!data || !data.access_token) {
      throw new HttpUnauthorizedError('Authentication failed');
    }

    return data.access_token;
  } catch (error) {
    if (error instanceof HttpUnauthorizedError) {
      throw error;
    }
    throw new HttpUnauthorizedError('Authentication failed');
  }
};

/**
 * Search for groups in D-Roles
 * @param email User's email address
 * @returns Search results with pagination information
 */
export const getGroupsByEmail = async (
  email: string
): Promise<IDRolesGroupSearchResponse> => {
  try {
    const accessToken = await getAccessToken();
    const route = routes.dRoles.groups.getGroupsByEmail(email);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    const data = await httpClient<IDRolesGroupSearchResponse>({
      url: route,
      method: 'GET',
      headers,
    });

    if (!data) {
      throw new HttpNotFound('No groups found matching the search criteria');
    }

    return data;
  } catch (error) {
    if (error instanceof HttpNotFound) {
      throw error;
    }
    throw new HttpNotFound('Error searching for groups');
  }
};
