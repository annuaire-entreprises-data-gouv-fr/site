import droleClient from '#clients/api-d-roles';
import { HttpUnauthorizedError } from '#clients/exceptions';
import { FetchRessourceException } from '#models/exceptions';
import { Groups } from '#models/groups';
import { logFatalErrorInSentry } from '#utils/sentry';

export class Group {
  private groupId: number;

  constructor(groupId: number) {
    this.groupId = groupId;
  }

  /**
   * Get the group ID
   */
  getId(): number {
    return this.groupId;
  }

  /**
   * Check if a user is an admin of this group
   */
  async isUserAdmin(userEmail: string, userSub: string): Promise<boolean> {
    try {
      const groups = await Groups.find(userEmail, userSub);
      const groupData =
        groups.find((group) => group.id === this.groupId) || null;

      if (!groupData) {
        return false;
      }

      const user = groupData.users.find((user) => user.email === userEmail);
      return user?.is_admin ?? false;
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'D-Roles Group Admin Check',
          cause: error,
        })
      );
      throw error;
    }
  }

  /**
   * Add a user to this group (requires admin permissions)
   */
  async updateName(groupName: string, actingUserSub: string): Promise<boolean> {
    try {
      await droleClient.updateName(this.groupId, groupName, actingUserSub);
      return true;
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'D-Roles Update Name of a Group',
          cause: error,
        })
      );
      throw error;
    }
  }

  /**
   * Add a user to this group (requires admin permissions)
   */
  async addUser(
    adminEmail: string,
    adminSub: string,
    userEmail: string,
    roleId: number
  ): Promise<boolean> {
    try {
      const isAdmin = await this.isUserAdmin(adminEmail, adminSub);
      if (!isAdmin) {
        throw new HttpUnauthorizedError(
          'User does not have admin permissions for this group'
        );
      }

      await droleClient.addUserToGroup(
        this.groupId,
        userEmail,
        roleId,
        adminSub
      );
      return true;
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'D-Roles Add User to Group',
          cause: error,
        })
      );
      throw error;
    }
  }

  /**
   * Update a user from a group (requires admin permissions)
   */
  async updateUser(
    adminEmail: string,
    adminSub: string,
    userEmail: string,
    roleId: number
  ): Promise<boolean> {
    try {
      const isAdmin = await this.isUserAdmin(adminEmail, adminSub);
      if (!isAdmin) {
        throw new HttpUnauthorizedError(
          'User does not have admin permissions for this group'
        );
      }

      await droleClient.updateUserFromGroup(
        this.groupId,
        userEmail,
        roleId,
        adminSub
      );
      return true;
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'D-Roles Update User From Group',
          cause: error,
        })
      );
      throw error;
    }
  }

  /**
   * Remove a user from this group (requires admin permissions)
   */
  async removeUserFromGroup(
    adminEmail: string,
    adminSub: string,
    userEmail: string
  ): Promise<boolean> {
    try {
      const isAdmin = await this.isUserAdmin(adminEmail, adminSub);
      if (!isAdmin) {
        throw new HttpUnauthorizedError(
          'User does not have admin permissions for this group'
        );
      }

      // Get the user ID to remove
      const user = await droleClient.getUserByEmail(userEmail);
      await droleClient.removeUserFromGroup(this.groupId, user.id, adminSub);
      return true;
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'D-Roles Remove User from Group',
          cause: error,
        })
      );
      throw error;
    }
  }
}
