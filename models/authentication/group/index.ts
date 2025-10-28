import { HttpNotFound } from "#clients/exceptions";
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

export type IAgentsGroup = {
  id: number;
  name: string;
  organisation_siret: string;
  users: IRolesDataUser[];
  scopes: IAgentScope[];
  contract_description: string;
  contract_url?: string;
};

export class AgentsGroup {
  data: IAgentsGroup;

  constructor(data: IAgentsGroup) {
    this.data = data;
  }

  static async run<T>(callback: () => Promise<T>): Promise<T> {
    try {
      return await callback();
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

  static async updateGroupName(
    groupId: number,
    newGroupName: string
  ): Promise<void> {
    return await AgentsGroup.run<void>(async () => {
      await clientRolesUpdateName(groupId, newGroupName);
    });
  }

  static async addUserToGroup(
    groupId: number,
    userEmail: string,
    roleId: number
  ): Promise<IRolesDataUser> {
    return await AgentsGroup.run<IRolesDataUser>(
      async () => await clientRolesAddUserToGroup(groupId, userEmail, roleId)
    );
  }

  static async updateUserRoleInGroup(
    groupId: number,
    userId: number,
    roleId: number
  ): Promise<IRolesDataUser> {
    return await AgentsGroup.run<IRolesDataUser>(
      async () => await clientRolesUpdateUserFromGroup(groupId, userId, roleId)
    );
  }

  static async removeUserFromGroup(
    groupId: number,
    userId: number
  ): Promise<void> {
    return await AgentsGroup.run<void>(
      async () => await clientRolesRemoveUserFromGroup(groupId, userId)
    );
  }
}
