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

export type IAgentsGroup = {
  id: number;
  name: string;
  organisation_siret: string;
  users: IRolesDataUser[];
  scopes: IAgentScope[];
  contract_description: string;
  contract_url?: string;
};

async function run<T>(callback: () => Promise<T>): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    // erreur pro connect et redirections

    logFatalErrorInSentry(
      new FetchRessourceException({
        ressource: "Roles.data",
        cause: error,
      })
    );
    throw error;
  }
}

export const getAgentGroups = async (): Promise<IAgentsGroup[]> => {
  return await run<IAgentsGroup[]>(async () => {
    try {
      return await clientRolesGetGroups();
    } catch (error) {
      if (error instanceof HttpNotFound) {
        // user not in roles.data
        return [];
      }
      throw error;
    }
  });
};

export async function updateGroupName(
  groupId: number,
  newGroupName: string
): Promise<void> {
  return await run<void>(async () => {
    await clientRolesUpdateName(groupId, newGroupName);
  });
}

export async function addUserToGroup(
  groupId: number,
  userEmail: string,
  roleId: number
): Promise<IRolesDataUser> {
  return await run<IRolesDataUser>(
    async () => await clientRolesAddUserToGroup(groupId, userEmail, roleId)
  );
}

export async function updateUserRoleInGroup(
  groupId: number,
  userId: number,
  roleId: number
): Promise<IRolesDataUser> {
  return await run<IRolesDataUser>(
    async () => await clientRolesUpdateUserFromGroup(groupId, userId, roleId)
  );
}

export async function removeUserFromGroup(
  groupId: number,
  userId: number
): Promise<void> {
  return await run<void>(
    async () => await clientRolesRemoveUserFromGroup(groupId, userId)
  );
}
