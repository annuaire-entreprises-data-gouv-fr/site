import { HttpNotFound } from "#clients/exceptions";
import { default as rolesDataClient } from "#clients/roles-data";
import type { IRolesDataUser } from "#clients/roles-data/interface";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import { FetchRessourceException } from "#models/exceptions";
import { logFatalErrorInSentry } from "#utils/sentry";

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
          ressource: "Roles.data Groups",
          cause: error,
        })
      );

      return [];
    }
  }
}
