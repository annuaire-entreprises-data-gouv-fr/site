import { IDRolesRoles, IDRolesUser } from '#clients/api-d-roles/interface';
import { FullTable } from '#components/table/full';
import { IDRolesGroup } from '#models/authentication/group/groups';
import AddUserModal from './add-user';
import DeleteUserButton from './delete-user';
import UpdateNameModal from './update-name';
import UpdateUserSelect from './update-user';

const NotAdminTable = ({ group }: { group: IDRolesGroup }) => {
  return (
    <FullTable
      head={['Membre', 'Rôle']}
      body={group.users.map((user) => [
        user.email,
        <span className="fr-badge">{user.role_name}</span>,
      ])}
    />
  );
};

export function GroupEntity({
  currentUserEmail,
  group,
  setGroup,
  isAdmin,
  roles,
}: {
  currentUserEmail: string;
  group: IDRolesGroup;
  isAdmin: boolean;
  setGroup: (group: IDRolesGroup) => void;
  roles: IDRolesRoles[];
}) {
  const defaultRoleId = roles.find((r) => r.role_name === 'utilisateur')?.id;

  const handleUpdateUser = (user: IDRolesUser) => {
    setGroup({
      ...group,
      users: group.users.map((currentUser) =>
        currentUser.email === user.email ? user : currentUser
      ),
    });
  };

  return (
    <div className="fr-card fr-mt-3w">
      <div className="fr-card__body">
        <div className="fr-card__content" style={{ display: 'flex' }}>
          <div className="fr-mb-3w">
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {!isAdmin ? (
                <h2 className="fr-mt-0">{group.name}</h2>
              ) : (
                <UpdateNameModal
                  groupId={group.id}
                  initialName={group.name}
                  updateGroupNameState={(name: string) => {
                    setGroup({
                      ...group,
                      name,
                    });
                  }}
                />
              )}
            </div>
            <div className="fr-text--alt fr-mb-1w">
              {group.users.length} membres
            </div>
            <div className="fr-badge">{group.contract_description}</div>
          </div>
          {!isAdmin ? (
            <NotAdminTable group={group} />
          ) : (
            <>
              <div style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}>
                <div>
                  <AddUserModal
                    group={group}
                    defaultRoleId={defaultRoleId!}
                    addUserToGroupState={(user: IDRolesUser) => {
                      setGroup({
                        ...group,
                        users: [...group.users, user],
                      });
                    }}
                  />
                </div>
              </div>

              <FullTable
                head={['Membre', 'Rôle', 'Action']}
                columnWidths={['30%', '30%', '20%']}
                body={group.users.map((user) => [
                  user.email,
                  user.email !== currentUserEmail ? (
                    <UpdateUserSelect
                      user={user}
                      groupId={group.id}
                      roles={roles}
                      updateUserFromGroupState={handleUpdateUser}
                    />
                  ) : (
                    <span className="fr-badge">{user.role_name}</span>
                  ),
                  <DeleteUserButton
                    isCurrentUser={user.email === currentUserEmail}
                    user={user}
                    groupId={group.id}
                    deleteUserFromGroupState={(userEmail: string) => {
                      setGroup({
                        ...group,
                        users: group.users.filter(
                          (user) => user.email !== userEmail
                        ),
                      });
                    }}
                  />,
                ])}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
