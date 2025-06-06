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
  async isUserAdmin(email: string): Promise<boolean> {
    try {
      const groups = await Groups.find(email);
      const groupData =
        groups.find((group) => group.id === this.groupId) || null;

      if (!groupData) {
        return false;
      }

      const user = groupData.users.find((user) => user.email === email);
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
  async addUser(
    adminEmail: string,
    userEmail: string,
    roleId: number
  ): Promise<boolean> {
    try {
      const isAdmin = await this.isUserAdmin(adminEmail);
      if (!isAdmin) {
        throw new HttpUnauthorizedError(
          'User does not have admin permissions for this group'
        );
      }

      await droleClient.addUserToGroup(this.groupId, userEmail, roleId);
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
   * Remove a user from this group (requires admin permissions)
   */
  async removeUserFromGroup(
    adminEmail: string,
    userEmail: string
  ): Promise<boolean> {
    try {
      const isAdmin = await this.isUserAdmin(adminEmail);
      if (!isAdmin) {
        throw new HttpUnauthorizedError(
          'User does not have admin permissions for this group'
        );
      }

      // Get the user ID to remove
      const user = await droleClient.getUserByEmail(userEmail);
      await droleClient.removeUserFromGroup(this.groupId, user.id);
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
