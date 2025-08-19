import { HttpNotFound } from '#clients/exceptions';
import rolesdataClient from '#clients/roles-data';
import { IRolesDataUser } from '#clients/roles-data/interface';
import { IAgentScope } from '#models/authentication/agent/scopes/constants';
import { FetchRessourceException } from '#models/exceptions';
import { logFatalErrorInSentry } from '#utils/sentry';

export type IRolesDataGroup = {
  name: string;
  id: number;
  organisation_siret: string;
  users: IRolesDataUser[];
  scopes: IAgentScope[];
  contract_description: string;
  contract_url?: string;
};

export class Groups {
  /**
   * Get all groups that a user belongs to
   */
  static async find(
    userEmail: string,
    userSub: string
  ): Promise<IRolesDataGroup[]> {
    try {
      return await rolesdataClient.getGroupsByEmail(userEmail, userSub);
    } catch (error) {
      if (error instanceof HttpNotFound) {
        // user not in roles.data
        return [];
      }

      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'Roles.data Groups',
          cause: error,
        })
      );

      return [];
    }
  }
}
