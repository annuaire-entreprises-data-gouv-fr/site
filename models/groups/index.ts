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
    email: string,
    actingUserSub?: string
  ): Promise<IDRolesGroup[]> {
    try {
      return await droleClient.getGroupsByEmail(email, actingUserSub);
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'D-Roles Groups',
          cause: error,
        })
      );
      throw error;
    }
  }
}
