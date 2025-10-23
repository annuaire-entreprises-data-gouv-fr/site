import { HttpNotFound, HttpUnauthorizedError } from "#clients/exceptions";
import {
  clientRolesAddUserToGroup,
  clientRolesGetGroups,
  clientRolesRemoveUserFromGroup,
  clientRolesUpdateName,
  clientRolesUpdateUserFromGroup,
} from "#clients/roles-data";
import type { IRolesDataUser } from "#clients/roles-data/interface";
import { FetchRessourceException } from "#models/exceptions";
import { logFatalErrorInSentry } from "#utils/sentry";
import type { IAgentScope } from "../agent/scopes/constants";

export const getAgentGroups = async (): Promise<AgentsGroup[]> => {
  try {
    const groups = await clientRolesGetGroups();

    return groups.map((g) => new AgentsGroup(g));
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
};

export type IRolesDataGroup = {
  id: number;
  name: string;
  organisation_siret: string;
  users: IRolesDataUser[];
  scopes: IAgentScope[];
  contract_description: string;
  contract_url?: string;
};

export class AgentsGroup {
  group: IRolesDataGroup;

  constructor(data: IRolesDataGroup) {
    this.group = data;
  }

  /**
   * Only run command if user is group admin
   */
  async adminRunner<T>(
    userEmail: string,
    callback: () => Promise<T>
  ): Promise<T> {
    try {
      const user = this.group.users.find((user) => user.email === userEmail);
      const isAdmin = user?.is_admin ?? false;
      if (isAdmin) {
        return await callback();
      }

      throw new HttpUnauthorizedError(
        "User does not have admin permissions for this group"
      );
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: "Roles.data",
          cause: error,
        })
      );
      throw error;
    }
  }

  async updateGroupName(
    adminEmail: string,
    newGroupName: string
  ): Promise<void> {
    return await this.adminRunner<void>(adminEmail, async () => {
      await clientRolesUpdateName(this.group.id, newGroupName);
    });
  }

  async addUserToGroup(
    adminEmail: string,
    userEmail: string,
    roleId: number
  ): Promise<IRolesDataUser> {
    return await this.adminRunner<IRolesDataUser>(
      adminEmail,
      async () =>
        await clientRolesAddUserToGroup(this.group.id, userEmail, roleId)
    );
  }

  async updateUserRoleInGroup(
    adminEmail: string,
    userId: number,
    roleId: number
  ): Promise<IRolesDataUser> {
    return await this.adminRunner<IRolesDataUser>(
      adminEmail,
      async () =>
        await clientRolesUpdateUserFromGroup(this.group.id, userId, roleId)
    );
  }

  async removeUserFromGroup(adminEmail: string, userId: number): Promise<void> {
    return await this.adminRunner<void>(
      adminEmail,
      async () => await clientRolesRemoveUserFromGroup(this.group.id, userId)
    );
  }
}
