import { HttpNotFound } from '#clients/exceptions';
import { default as rolesDataClient } from '#clients/roles-data';
import { IRolesDataUser } from '#clients/roles-data/interface';
import { IAgentScope } from '#models/authentication/agent/scopes/constants';
import { FetchRessourceException } from '#models/exceptions';
import { Siret } from '#utils/helpers';
import { logFatalErrorInSentry } from '#utils/sentry';

export type IRolesDataGroup = {
  id: number;
  name: string;
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
      return await rolesDataClient.getGroupsByEmail(userEmail, userSub);
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

  /**
   * Create a new group
   */
  static async create(
    userEmail: string,
    userSub: string,
    groupName: string,
    emails: string[],
    contract_url: string,
    contract_description: string,
    scopes: string,
    siret: Siret
  ): Promise<IRolesDataGroup> {
    try {
      const body = {
        name: groupName,
        organisation_siret: siret,
        admin: {
          email: userEmail,
        },
        scopes,
        contract_url,
        contract_description,
        members: emails?.map((email) => ({
          email,
        })),
      };

      return await rolesDataClient.create(body, userSub);
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'Roles.data Groups',
          cause: error,
        })
      );
      throw error;
    }
  }
}
