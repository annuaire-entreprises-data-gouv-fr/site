import { IDRolesRoles } from '#clients/api-d-roles/interface';
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
  const getCurrentRoleId = (userRoleName: string) => {
    const role = roles.find((r) => r.role_name === userRoleName);
    return role?.id || 0;
  };
  const defaultRoleId = roles.find((r) => r.role_name === 'utilisateur')?.id;

  const getCurrentRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.role_name || '';
  };

  const handleAddNewUser = ({ email, id }: { email: string; id: number }) => {
    setGroup({
      ...group,
      users: [
        ...group.users,
        {
          email,
          id,
          role_name: getCurrentRoleName(defaultRoleId!),
          is_admin: false,
        },
      ],
    });
  };

  const handleUpdateUser = ({
    email,
    roleId,
  }: {
    email: string;
    roleId: number;
  }) => {
    setGroup({
      ...group,
      users: group.users.map((user) =>
        user.email === email
          ? {
              ...user,
              role_name: roles.find((r) => r.id === roleId)?.role_name!,
            }
          : user
      ),
    });
  };

  return (
    <div className="fr-card">
      <div className="fr-card__body">
        <div className="fr-card__content" style={{ display: 'flex' }}>
          <div className="fr-mb-3w">
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <UpdateNameModal
                groupId={group.id}
                initialName={group.name}
                updateName={(name: string) => {
                  setGroup({
                    ...group,
                    name,
                  });
                }}
              />
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
                    groupId={group.id}
                    defaultRoleId={defaultRoleId!}
                    addNewUser={handleAddNewUser}
                  />
                </div>
              </div>

              <FullTable
                head={['Membre', 'Rôle', 'Action']}
                body={group.users.map((user) => [
                  user.email,
                  user.email !== currentUserEmail ? (
                    <UpdateUserSelect
                      userEmail={user.email}
                      roleId={getCurrentRoleId(user.role_name)}
                      groupId={group.id}
                      roles={roles}
                      updateUser={handleUpdateUser}
                    />
                  ) : (
                    <span className="fr-badge">{user.role_name}</span>
                  ),
                  user.email !== currentUserEmail ? (
                    <DeleteUserButton
                      userEmail={user.email}
                      groupId={group.id}
                      deleteUser={(userEmail: string) => {
                        setGroup({
                          ...group,
                          users: group.users.filter(
                            (user) => user.email !== userEmail
                          ),
                        });
                      }}
                    />
                  ) : null,
                ])}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
