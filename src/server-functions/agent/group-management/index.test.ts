import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  HttpBadRequestError,
  HttpConflict,
  HttpForbiddenError,
  HttpNotFound,
} from "#/clients/exceptions";
import type { IRolesDataUser } from "#/clients/roles-data/interface";
import { addUsersToGroup, addUserToGroup } from "#/models/authentication/group";
import { addUsersToGroupFn, addUserToGroupFn } from ".";

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    const builder = {
      middleware: () => builder,
      validator: () => builder,
      handler: (handler: unknown) => handler,
    };
    return builder;
  },
}));

vi.mock("#/clients/roles-data/index.server", () => ({
  clientRolesGetOrganizationsGroups: vi.fn(),
}));

vi.mock("#/models/authentication/group", () => ({
  addUsersToGroup: vi.fn(),
  addUserToGroup: vi.fn(),
  getAgentGroup: vi.fn(),
  getAgentGroups: vi.fn(),
  removeUserFromGroup: vi.fn(),
  updateGroupName: vi.fn(),
  updateUserRoleInGroup: vi.fn(),
}));

vi.mock("#/models/authentication/group/roles", () => ({
  rolesMetadataStore: { getRoles: vi.fn() },
}));

vi.mock("#/server-functions/middlewares", () => ({
  agentFnMiddleware: {},
}));

const request = {
  data: { groupId: 1, userEmail: "agent@example.fr", roleId: 2 },
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("addUserToGroupFn", () => {
  it("returns a serializable duplicate result for a roles server conflict", async () => {
    vi.mocked(addUserToGroup).mockRejectedValue(new HttpConflict("Conflict"));

    await expect(addUserToGroupFn(request)).resolves.toEqual({
      error: "USER_ALREADY_IN_GROUP",
    });
  });

  it("returns the added user unchanged", async () => {
    const user: IRolesDataUser = {
      email: request.data.userEmail,
      id: 3,
      is_admin: false,
      role_id: request.data.roleId,
      role_name: "Utilisateur",
    };
    vi.mocked(addUserToGroup).mockResolvedValue(user);

    await expect(addUserToGroupFn(request)).resolves.toBe(user);
    expect(addUserToGroup).toHaveBeenCalledWith(
      request.data.groupId,
      request.data.userEmail,
      request.data.roleId
    );
  });

  it("rethrows other roles server errors", async () => {
    const error = new HttpForbiddenError("Forbidden");
    vi.mocked(addUserToGroup).mockRejectedValue(error);

    await expect(addUserToGroupFn(request)).rejects.toBe(error);
  });
});

describe("addUsersToGroupFn", () => {
  const batchRequest = {
    data: {
      groupId: 1,
      userEmails: ["a@example.fr", "b@example.fr"],
      roleId: 2,
    },
  };

  it.each([
    [new HttpConflict("Conflict"), "USER_ALREADY_IN_GROUP"],
    [new HttpBadRequestError("Bad Request"), "DUPLICATE_EMAILS"],
    [new HttpNotFound("Not Found"), "GROUP_OR_ROLE_NOT_FOUND"],
  ])("returns a serializable result for %s", async (error, expected) => {
    vi.mocked(addUsersToGroup).mockRejectedValue(error);

    await expect(addUsersToGroupFn(batchRequest)).resolves.toEqual({
      error: expected,
    });
  });

  it("returns the added users", async () => {
    const users: IRolesDataUser[] = batchRequest.data.userEmails.map(
      (email, id) => ({
        email,
        id,
        is_admin: false,
        role_id: batchRequest.data.roleId,
        role_name: "Utilisateur",
      })
    );
    vi.mocked(addUsersToGroup).mockResolvedValue(users);

    await expect(addUsersToGroupFn(batchRequest)).resolves.toBe(users);
    expect(addUsersToGroup).toHaveBeenCalledWith(
      batchRequest.data.groupId,
      batchRequest.data.userEmails,
      batchRequest.data.roleId
    );
  });

  it("rethrows other roles server errors", async () => {
    const error = new HttpForbiddenError("Forbidden");
    vi.mocked(addUsersToGroup).mockRejectedValue(error);

    await expect(addUsersToGroupFn(batchRequest)).rejects.toBe(error);
  });
});
