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
  onPageChange,
  onGroupChange,
  onLeaveGroup,
}: {
  group: IAgentsGroupDetails;
  roles: IRolesDataRoles[];
  onPageChange: (page: number) => void;
  // reloads the group after an update
  onGroupChange: () => void;
  onLeaveGroup: () => void;
}) {
  const { user: currentUser } = useAuth();
  const currentUserEmail = currentUser?.email;
  const defaultRoleId = roles.find((r) => r.role_name === "utilisateur")?.id;
  const { page, total, totalPages } = group.usersPagination;
  const isAdmin = group.current_user_role.is_admin;
  // Admins are listed first: an admin shown on a later page means every
  // previous page is full of admins. So the current user is the last admin
  // only if they are the only admin of the first page.
  const isLastAdmin =
    isAdmin &&
    page === 1 &&
    group.users.filter((user) => user.is_admin).length === 1;

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
      <div className="fr-mt-5w fr-mb-3w">
        <div
          className="fr-mb-2w"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <h1 className="fr-my-0">{group.name}</h1>
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
            isCurrentUser(user) && isLastAdmin ? (
              <span className="fr-badge">{user.role_name}</span>
            ) : (
              <UpdateUserSelect
                groupId={group.id}
                key={user.id}
                roles={roles}
                updateUserFromGroupState={onGroupChange}
                user={user}
              />
            ),
            <DeleteUserButton
              deleteUserFromGroupState={() => {
                if (isCurrentUser(user)) {
                  onLeaveGroup();
                } else {
                  onGroupChange();
                }
              }}
              groupId={group.id}
              isCurrentUser={isCurrentUser(user)}
              isLastAdmin={isCurrentUser(user) && isLastAdmin}
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
