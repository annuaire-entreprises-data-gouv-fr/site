import { notFound, redirect } from "@tanstack/react-router";
import { ProConnectReconnexionNeeded } from "#/clients/authentication/pro-connect/exceptions";
import { HttpForbiddenError, HttpNotFound } from "#/clients/exceptions";
import {
  clientRolesAddUsersToGroupBatch,
  clientRolesAddUserToGroup,
  clientRolesGetGroup,
  clientRolesGetGroups,
  clientRolesRemoveUserFromGroup,
  clientRolesUpdateName,
  clientRolesUpdateUserFromGroup,
} from "#/clients/roles-data/index.server";
import type {
  IRolesDataCurrentUserRole,
  IRolesDataGroupAdmin,
  IRolesDataUser,
} from "#/clients/roles-data/interface";
import { FetchRessourceException } from "#/models/exceptions";
import { logFatalErrorInSentry } from "#/utils/sentry";
import type { IAgentScope } from "../agent/scopes/constants";

interface IAgentsGroupBase {
  contract_description: string;
  contract_url?: string;
  id: number;
  name: string;
  organisation_siret: string;
  scopes: IAgentScope[];
}

export interface IAgentsGroup extends IAgentsGroupBase {
  // at most the 3 oldest admins of the group
  admins: IRolesDataGroupAdmin[];
  current_user_role: IRolesDataCurrentUserRole;
}

export interface IAgentsGroupDetails extends IAgentsGroupBase {
  // admins come first
  users: IRolesDataUser[];
  usersPagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export const GROUP_USERS_PAGE_SIZE = 50;

export interface IAgentsOrganizationGroup {
  adminEmails: string[];
  id: number;
  name: string;
  scopes: IAgentScope[];
}

async function run<T>(callback: () => Promise<T>): Promise<T> {
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

export const getAgentGroups = async ({
  allowProConnectRedirection,
}: {
  allowProConnectRedirection: boolean;
}): Promise<IAgentsGroup[]> => {
  return await run<IAgentsGroup[]>(async () => {
    try {
      return await clientRolesGetGroups();
    } catch (error) {
      if (error instanceof HttpNotFound) {
        // user not in roles.data
        return [];
      }
      if (
        allowProConnectRedirection &&
        error instanceof ProConnectReconnexionNeeded
      ) {
        throw redirect({ to: "/api/auth/agent-connect/login" });
      }
      throw error;
    }
  });
};

export async function getAgentGroup(
  groupId: number,
  usersPage: number
): Promise<IAgentsGroupDetails> {
  try {
    return await clientRolesGetGroup(groupId, usersPage, GROUP_USERS_PAGE_SIZE);
  } catch (error) {
    // group does not exist or user is not a member of the group
    if (error instanceof HttpNotFound || error instanceof HttpForbiddenError) {
      throw notFound();
    }
    if (error instanceof ProConnectReconnexionNeeded) {
      throw redirect({ to: "/api/auth/agent-connect/login" });
    }
    logFatalErrorInSentry(
      new FetchRessourceException({
        ressource: "Roles.data",
        cause: error,
      })
    );
    throw error;
  }
}

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

export async function addUsersToGroup(
  groupId: number,
  userEmails: string[],
  roleId: number
): Promise<IRolesDataUser[]> {
  return await run<IRolesDataUser[]>(
    async () =>
      await clientRolesAddUsersToGroupBatch(groupId, userEmails, roleId)
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
