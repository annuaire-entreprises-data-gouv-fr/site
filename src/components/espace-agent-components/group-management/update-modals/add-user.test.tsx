import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IRolesDataUser } from "#/clients/roles-data/interface";
import type { Modal } from "#/components-ui/modal";
import {
  NotificationContext,
  NotificationTypeEnum,
} from "#/hooks/use-notification";
import type { IAgentsGroup } from "#/models/authentication/group";
import AddUserModal from "./add-user";

const { execute } = vi.hoisted(() => ({ execute: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => execute }));
vi.mock("#/server-functions/agent/group-management", () => ({
  addUserToGroupFn: { url: "/test/add-user-to-group" },
}));
vi.mock("#/components-ui/modal", () => ({
  Modal: ({ children, isVisible }: ComponentProps<typeof Modal>) =>
    isVisible ? <div role="dialog">{children}</div> : null,
}));

const existingUser: IRolesDataUser = {
  email: "existing@example.fr",
  id: 1,
  is_admin: false,
  role_id: 2,
  role_name: "Utilisateur",
};
const newUser: IRolesDataUser = {
  ...existingUser,
  email: "new@example.fr",
  id: 2,
};
const group: IAgentsGroup = {
  contract_description: "Convention exemple",
  id: 3,
  name: "Groupe exemple",
  organisation_siret: "13002526500013",
  scopes: [],
  users: [existingUser],
};
const duplicateMessage = "Cet utilisateur est déjà membre de ce groupe";
const addUserToGroupState = vi.fn();
const showNotification = vi.fn();
let client: QueryClient;

function openModal() {
  render(
    <QueryClientProvider client={client}>
      <NotificationContext.Provider value={{ showNotification }}>
        <AddUserModal
          addUserToGroupState={addUserToGroupState}
          defaultRoleId={2}
          group={group}
        />
      </NotificationContext.Provider>
    </QueryClientProvider>
  );
  fireEvent.click(screen.getByRole("button", { name: "Ajouter un membre" }));
  return screen.getByRole<HTMLInputElement>("textbox", {
    name: "Adresse email du nouveau membre",
  });
}

beforeEach(() => {
  client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  execute.mockReset();
  execute.mockResolvedValue(newUser);
  addUserToGroupState.mockReset();
  showNotification.mockReset();
});
afterEach(() => {
  cleanup();
  client.clear();
});

describe("adding a group member", () => {
  it.each([existingUser.email, "  EXISTING@EXAMPLE.FR  "])(
    "blocks an existing email while typing %s and allows editing it",
    (email) => {
      const input = openModal();
      fireEvent.change(input, { target: { value: email } });

      expect(screen.getByText(duplicateMessage)).toBeTruthy();
      expect(
        screen.getByRole<HTMLButtonElement>("button", { name: "Ajouter" })
          .disabled
      ).toBe(true);
      expect(input.getAttribute("aria-describedby")).toBe(
        screen.getByText(duplicateMessage).parentElement?.id
      );
      fireEvent.keyDown(input, { key: "Enter" });
      expect(execute).not.toHaveBeenCalled();

      fireEvent.change(input, { target: { value: newUser.email } });

      expect(screen.queryByText(duplicateMessage)).toBeNull();
      expect(
        screen.getByRole<HTMLButtonElement>("button", { name: "Ajouter" })
          .disabled
      ).toBe(false);
      expect(input.getAttribute("aria-describedby")).toBeNull();
    }
  );

  it("shows a server conflict inline and keeps the modal open", async () => {
    execute.mockResolvedValue({ error: "USER_ALREADY_IN_GROUP" });
    const input = openModal();
    fireEvent.change(input, { target: { value: newUser.email } });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(await screen.findByText(duplicateMessage)).toBeTruthy();
    expect(showNotification).toHaveBeenCalledWith({
      type: NotificationTypeEnum.ERROR,
      title: "Ajout impossible",
      message: duplicateMessage,
    });
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(addUserToGroupState).not.toHaveBeenCalled();
    expect(input.value).toBe(newUser.email);

    fireEvent.change(input, { target: { value: "other@example.fr" } });

    expect(screen.queryByText(duplicateMessage)).toBeNull();
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Ajouter" })
        .disabled
    ).toBe(false);
  });

  it("preserves the notification for other request errors", async () => {
    execute.mockRejectedValue(new Error("Service indisponible"));
    const input = openModal();
    fireEvent.change(input, { target: { value: newUser.email } });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith({
        type: NotificationTypeEnum.ERROR,
        title: "Erreur lors de l'ajout du membre",
        message: "Service indisponible",
      });
    });
    expect(screen.queryByText(duplicateMessage)).toBeNull();
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(addUserToGroupState).not.toHaveBeenCalled();
  });

  it("adds a new member, announces success and resets the modal", async () => {
    const input = openModal();
    fireEvent.change(input, { target: { value: "  new@example.fr  " } });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));

    await waitFor(() =>
      expect(addUserToGroupState).toHaveBeenCalledWith(newUser)
    );
    expect(execute.mock.calls[0][0]).toEqual({
      data: { groupId: group.id, userEmail: newUser.email, roleId: 2 },
    });
    expect(showNotification).toHaveBeenCalledWith({
      type: NotificationTypeEnum.SUCCESS,
      title: "Membre ajouté avec succès",
      message: `${newUser.email} a été ajouté au groupe ${group.name}`,
    });
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Ajouter un membre" }));

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("");
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Ajouter" })
        .disabled
    ).toBe(true);
  });
});
