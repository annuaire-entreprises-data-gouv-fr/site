import type {
  IRolesDataRoles,
  IRolesDataUser,
} from "#/clients/roles-data/interface";
import LocalPageCounter from "#/components/search-results/results-pagination/local-pagination";
import { FullTable } from "#/components/table/full";
import { useAuth } from "#/contexts/auth.context";
import type { IAgentsGroupDetails } from "#/models/authentication/group";
import { GroupInfos } from "./group-infos";
import AddUserModal from "./update-modals/add-user";
import DeleteUserButton from "./update-modals/delete-user";
import UpdateNameModal from "./update-modals/update-name";
import UpdateUserSelect from "./update-modals/update-user";

const CurrentUserBadge = () => (
  <span className="fr-badge fr-ml-1w fr-badge--success fr-badge--sm">Vous</span>
);

export function GroupDetails({
  group,
  roles,
  isAdmin,
  adminCount,
  onPageChange,
  onGroupChange,
  onLeaveGroup,
}: {
  group: IAgentsGroupDetails;
  roles: IRolesDataRoles[];
  isAdmin: boolean;
  // capped at 3 by roles.data, which is enough to know if there is more than one admin
  adminCount: number;
  onPageChange: (page: number) => void;
  // reloads the group after an update
  onGroupChange: () => void;
  onLeaveGroup: () => void;
}) {
  const { user: currentUser } = useAuth();
  const currentUserEmail = currentUser?.email;
  const defaultRoleId = roles.find((r) => r.role_name === "utilisateur")?.id;
  const { page, total, totalPages } = group.usersPagination;

  const isCurrentUser = (user: IRolesDataUser) =>
    user.email.toLowerCase() === currentUserEmail;

  const userCell = (user: IRolesDataUser) => (
    <>
      {user.email}
      {isCurrentUser(user) && <CurrentUserBadge />}
    </>
  );

  return (
    <>
      <div className="fr-mb-3w">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h1 className="fr-mt-0 fr-mb-0">{group.name}</h1>
          {isAdmin && (
            <UpdateNameModal
              groupId={group.id}
              initialName={group.name}
              updateGroupNameState={onGroupChange}
            />
          )}
        </div>
        <GroupInfos group={group} isAdmin={isAdmin} />
      </div>

      {isAdmin && defaultRoleId !== undefined && (
        <div className="fr-mb-2w">
          <AddUserModal
            addUsersToGroupState={onGroupChange}
            defaultRoleId={defaultRoleId}
            group={group}
          />
        </div>
      )}

      {isAdmin ? (
        <FullTable
          body={group.users.map((user) => [
            <div style={{ flexGrow: 1 }}>{userCell(user)}</div>,
            !isCurrentUser(user) || adminCount >= 2 ? (
              <UpdateUserSelect
                groupId={group.id}
                key={user.id}
                roles={roles}
                updateUserFromGroupState={onGroupChange}
                user={user}
              />
            ) : (
              <span className="fr-badge">{user.role_name}</span>
            ),
            <DeleteUserButton
              adminCount={adminCount}
              deleteUserFromGroupState={() => {
                if (isCurrentUser(user)) {
                  onLeaveGroup();
                } else {
                  onGroupChange();
                }
              }}
              groupId={group.id}
              isCurrentUser={isCurrentUser(user)}
              key={user.id}
              user={user}
            />,
          ])}
          columnWidths={["65%"]}
          head={[`Membres (${total})`, "Rôle", "Action"]}
        />
      ) : (
        <FullTable
          body={group.users.map((user) => [
            userCell(user),
            <span className="fr-badge">{user.role_name}</span>,
          ])}
          head={[`Membres (${total})`, "Rôle"]}
        />
      )}

      <LocalPageCounter
        currentPage={page}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
    </>
  );
}
