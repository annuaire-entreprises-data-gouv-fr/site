import { IDRolesRoles } from '#clients/api-d-roles/interface';
import ButtonLink from '#components-ui/button';
import { FullTable } from '#components/table/full';
import { IDRolesGroup } from '#models/authentication/group/groups';
import httpClient from '#utils/network';
import { useState } from 'react';
import AddUserModal from './add-user';
import UpdateNameModal from './update-name';
import UpdateUserSelect from './update-user';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateNameModalVisible, setUpdateNameModalVisible] = useState(false);
  const [adduserModalVisible, setAdduserModalVisible] = useState(false);

  const getCurrentRoleId = (userRoleName: string) => {
    const role = roles.find((r) => r.role_name === userRoleName);
    return role?.id || 0;
  };
  const defaultRoleId = roles.find((r) => r.role_name === 'utilisateur')?.id;

  const getCurrentRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.role_name || '';
  };
  const adminRoleName = roles.find((r) => r.is_admin)?.role_name;

  const handleRemove = (userEmail: string) => async () => {
    setLoading(true);
    setError(null);

    try {
      await httpClient({
        url: `/api/groups/${group.id}/remove-user`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ userEmail }),
      });

      setGroup({
        ...group,
        users: group.users.filter((user) => user.email !== userEmail),
      });
    } catch (error) {
      console.error('Error removing user from team:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-card">
      <div className="fr-card__body">
        <div className="fr-card__content" style={{ display: 'flex' }}>
          <div className="fr-mb-3w">
            <div className="fr-text--xl fr-text--bold fr-mb-1w">
              {group.name}
            </div>
            <div className="fr-badge fr-mb-1w">
              {group.contract_description}
            </div>
            <div className="fr-text--alt">{group.users.length} membres</div>
          </div>
          {isAdmin && (
            <>
              <div style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}>
                <div>
                  <ButtonLink onClick={() => setUpdateNameModalVisible(true)}>
                    Renommer l‘équipe
                  </ButtonLink>
                  <ButtonLink onClick={() => setAdduserModalVisible(true)}>
                    Ajouter un membre
                  </ButtonLink>
                </div>
              </div>
              <AddUserModal
                visible={adduserModalVisible}
                cancel={() => setAdduserModalVisible(false)}
                groupId={group.id}
                defaultRoleId={defaultRoleId!}
                addNewUser={({ email, id }) => {
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
                }}
              />
              <UpdateNameModal
                visible={updateNameModalVisible}
                cancel={() => setUpdateNameModalVisible(false)}
                groupId={group.id}
                initialName={group.name}
                updateName={(name: string) => {
                  setGroup({
                    ...group,
                    name,
                  });
                }}
              />
            </>
          )}

          {error && <p className="fr-error-text">{error}</p>}

          <FullTable
            head={['Membre', 'Rôle', 'Action']}
            body={group.users.map((user) => [
              user.email,
              isAdmin && user.email !== currentUserEmail ? (
                <UpdateUserSelect
                  userEmail={user.email}
                  roleId={getCurrentRoleId(user.role_name)}
                  groupId={group.id}
                  roles={roles}
                  updateUser={({ email, roleId }) => {
                    setGroup({
                      ...group,
                      users: group.users.map((user) =>
                        user.email === email
                          ? {
                              ...user,
                              role_name:
                                roles.find((r) => r.id === roleId)?.role_name ||
                                user.role_name,
                            }
                          : user
                      ),
                    });
                  }}
                />
              ) : user.role_name === adminRoleName ? (
                <span className="fr-badge fr-badge--new">{user.role_name}</span>
              ) : (
                <span className="fr-badge">{user.role_name}</span>
              ),
              isAdmin && user.email !== currentUserEmail ? (
                <button
                  key={`remove-${user.email}`}
                  type="button"
                  className="fr-btn fr-btn--tertiary-no-outline"
                  title="Supprimer"
                  aria-label={`Supprimer ${user.email}`}
                  onClick={handleRemove(user.email)}
                  disabled={loading}
                >
                  <span aria-hidden="true">🗑️</span>
                </button>
              ) : null,
            ])}
          />
        </div>
      </div>
    </div>
  );
}
