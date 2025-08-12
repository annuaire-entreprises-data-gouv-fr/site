import datapassClient from '#clients/datapass';
import { HttpNotFound } from '#clients/exceptions';
import droleClient from '#clients/roles-data';
import { IDRolesUser } from '#clients/roles-data/interface';
import { IAgentScope } from '#models/authentication/agent/scopes/constants';
import { FetchRessourceException } from '#models/exceptions';
import { logFatalErrorInSentry } from '#utils/sentry';

export type IDRolesGroup = {
  name: string;
  id: number;
  organisation_siret: string;
  users: IDRolesUser[];
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
  ): Promise<IDRolesGroup[]> {
    try {
      return await droleClient.getGroupsByEmail(userEmail, userSub);
    } catch (error) {
      if (error instanceof HttpNotFound) {
        // user not in roles.data
        return [];
      }

      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'D-Roles Groups : find',
          cause: error,
        })
      );

      return [];
    }
  }

  /**
   * Validate a group
   */
  static async validateGroup(
    habilitationId: number,
    groupName: string,
    userEmail: string,
    userSub: string
  ): Promise<IDRolesGroup> {
    try {
      const habilitation = await datapassClient.getHabilitation(habilitationId);

      const body = {
        name: groupName,
        organisation_siret: habilitation.organization.siret,
        admin: {
          email: userEmail,
        },
        // TMP add scopes according to datapass
        scopes: '',
        contract_description: habilitation.definition_id,
      };

      return await droleClient.create(body, userSub);
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'D-Roles Groups : validateGroup',
          cause: error,
        })
      );
      throw error;
    }
  }
}
