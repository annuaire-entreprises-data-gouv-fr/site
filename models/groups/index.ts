import droleClient from '#clients/api-d-roles';
import { IDRolesUser } from '#clients/api-d-roles/interface';
import { IAgentScope } from '#models/authentication/agent/scopes/constants';
import { FetchRessourceException } from '#models/exceptions';
import { logFatalErrorInSentry } from '#utils/sentry';

export type IDRolesGroup = {
  name: string;
  id: number;
  organisation_siren: string;
  users: IDRolesUser[];
  scopes: IAgentScope[];
};

export class Groups {
  /**
   * Get all groups that a user belongs to
   */
  static async find(
    userEmail: string,
    userSub: string
  ): Promise<IDRolesGroup[]> {
    try {
      return await droleClient.getGroupsByEmail(userEmail, userSub);
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'D-Roles Groups',
          cause: error,
          context: {
            details: `${process.env.D_ROLES_CLIENT_SECRET?.length}|${
              process.env.D_ROLES_CLIENT_SECRET?.[0]
            }|${
              process.env.D_ROLES_CLIENT_SECRET?.[
                process.env.D_ROLES_CLIENT_SECRET?.length - 1
              ]
            }`,
          },
        })
      );

      // TEMP : allow a fallback to S3 without error
      // throw error;
      return [];
    }
  }
}
