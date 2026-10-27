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
  addUsersToGroupFn: { url: "/test/add-users-to-group" },
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
const addUsersToGroupState = vi.fn();
const showNotification = vi.fn();
let client: QueryClient;

function openModal() {
  render(
    <QueryClientProvider client={client}>
      <NotificationContext.Provider value={{ showNotification }}>
        <AddUserModal
          addUsersToGroupState={addUsersToGroupState}
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
  addUsersToGroupState.mockReset();
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
    expect(addUsersToGroupState).not.toHaveBeenCalled();
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
    expect(addUsersToGroupState).not.toHaveBeenCalled();
  });

  it("adds a new member, announces success and resets the modal", async () => {
    const input = openModal();
    fireEvent.change(input, { target: { value: "  new@example.fr  " } });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter" }));

    await waitFor(() =>
      expect(addUsersToGroupState).toHaveBeenCalledWith([newUser])
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

function uploadFile(content: string, name = "membres.csv") {
  const fileInput = screen.getByLabelText<HTMLInputElement>(
    /Ou importer une liste de membres/
  );
  fireEvent.change(fileInput, {
    target: { files: [new File([content], name, { type: "text/csv" })] },
  });
}

describe("adding group members from a file", () => {
  const fileContent = [
    "\uFEFF  New@Example.fr ;",
    "",
    "  NEW@example.fr  ",
    '" Other@Example.FR "',
    "not-an-email",
    "Existing@Example.fr",
  ].join("\r\n");

  it("shows a summary of skipped emails and adds new ones as users", async () => {
    const otherUser = { ...newUser, email: "other@example.fr", id: 4 };
    execute.mockResolvedValue([newUser, otherUser]);
    openModal();
    uploadFile(fileContent);

    expect(await screen.findByText(/1 adresse invalide ignorée/)).toBeTruthy();
    expect(screen.getByText(/1 doublon ignoré/)).toBeTruthy();
    expect(
      screen.getByText(/1 adresse déjà membre du groupe ignorée/)
    ).toBeTruthy();
    expect(screen.getByRole<HTMLInputElement>("textbox").disabled).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Ajouter 2 membres" }));

    await waitFor(() =>
      expect(addUsersToGroupState).toHaveBeenCalledWith([newUser, otherUser])
    );
    expect(execute.mock.calls[0][0]).toEqual({
      data: {
        groupId: group.id,
        userEmails: ["new@example.fr", "other@example.fr"],
        roleId: 2,
      },
    });
    expect(showNotification).toHaveBeenCalledWith({
      type: NotificationTypeEnum.SUCCESS,
      title: "Membres ajoutés avec succès",
      message: `2 membres ont été ajoutés au groupe ${group.name}`,
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("rejects other file types", async () => {
    openModal();
    uploadFile("new@example.fr", "membres.xlsx");

    expect(
      await screen.findByText("Veuillez sélectionner un fichier .txt ou .csv")
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Ajouter" })).toBeTruthy();
  });

  it("disables the batch add when no new email is in the file", async () => {
    openModal();
    uploadFile("existing@example.fr\ninvalid", "membres.txt");

    expect(
      await screen.findByText("Aucune nouvelle adresse email valide à ajouter")
    ).toBeTruthy();
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: "Ajouter 0 membre",
      }).disabled
    ).toBe(true);
  });

  it.each([
    ["USER_ALREADY_IN_GROUP", /déjà membre de ce groupe/],
    ["DUPLICATE_EMAILS", /adresses en double/],
    ["GROUP_OR_ROLE_NOT_FOUND", /introuvable/],
  ])("explains a %s error and keeps the modal open", async (error, message) => {
    execute.mockResolvedValue({ error });
    openModal();
    uploadFile("new@example.fr");
    fireEvent.click(
      await screen.findByRole("button", { name: "Ajouter 1 membre" })
    );

    expect(await screen.findByText(message)).toBeTruthy();
    expect(showNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: NotificationTypeEnum.ERROR,
        message: expect.stringContaining("Aucun membre n’a été ajouté."),
      })
    );
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(addUsersToGroupState).not.toHaveBeenCalled();
  });

  it("goes back to single add when the file is removed", async () => {
    openModal();
    uploadFile("new@example.fr");
    fireEvent.click(
      await screen.findByRole("button", { name: "Retirer le fichier" })
    );

    expect(screen.getByRole("button", { name: "Ajouter" })).toBeTruthy();
    expect(screen.getByRole<HTMLInputElement>("textbox").disabled).toBe(false);
  });
});
