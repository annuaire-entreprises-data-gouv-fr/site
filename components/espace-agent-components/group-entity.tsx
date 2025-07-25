import { IDRolesUser } from '#clients/api-d-roles/interface';
import { FullTable } from '#components/table/full';
import { IDRolesGroup } from '#models/groups';
import { useState } from 'react';
import AddUser from './add-user';
import UpdateName from './update-name';

export function GroupEntity({
  group,
  setGroup,
  isAdmin,
  roles,
}: {
  group: IDRolesGroup;
  isAdmin: boolean;
  setGroup: (group: IDRolesGroup) => void;
  roles: IDRolesUser[];
}) {
  const [loading, setLoading] = useState(false);

  const getCurrentRoleId = (userRoleName: string) => {
    const role = roles.find((r) => r.role_name === userRoleName);
    return role?.id || 0;
  };

  const getCurrentRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.role_name || '';
  };
  const adminRoleName = roles.find((r) => r.is_admin)?.role_name;

  const updateName = async (groupName: string) => {
    const response = await fetch(`/api/teams/${group.id}/update-name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupName }),
    });

    if (!response.ok) {
      throw new Error('Failed to update team name');
    }

    setGroup({ ...group, name: groupName });
  };

  const addNewUser = async (inputEmail: string) => {
    if (!inputEmail || !inputEmail.trim()) return;
    const userEmail = inputEmail.trim();
    const defaultRoleId = roles.length > 0 ? roles[0].id : 0;

    const response = await fetch(`/api/teams/${group.id}/add-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail, roleId: defaultRoleId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add user to team');
    }

    setGroup({
      ...group,
      users: [
        ...group.users,
        {
          email: userEmail,
          role_name: getCurrentRoleName(defaultRoleId),
          id: 0,
          is_admin: false,
        },
      ],
    });
  };

  const handleUpdate = (userEmail: string) => async (roleId: number) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/teams/${group.id}/update-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, roleId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user in team');
      }

      setGroup({
        ...group,
        users: group.users.map((user) =>
          user.email === userEmail
            ? {
                ...user,
                role_name:
                  roles.find((r) => r.id === roleId)?.role_name ||
                  user.role_name,
              }
            : user
        ),
      });
    } catch (error) {
      console.error('Error updating user in team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (userEmail: string) => async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/teams/${group.id}/remove-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove user from team');
      }

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
        <div className="fr-card__content">
          <div
            className="fr-grid-row fr-grid-row--gutters"
            style={{ alignItems: 'center' }}
          >
            <div className="fr-col">
              <div className="fr-text--xl fr-text--bold">
                <div className="fr-grid-row fr-grid-row--middle">
                  <div className="fr-col">{group.name}</div>
                  <span className="fr-badge">{group.contract}</span>
                </div>
              </div>
              <div className="fr-text--sm">{group.users.length} membres</div>
            </div>
            {isAdmin && (
              <div className="fr-col-auto">
                <div className="fr-grid-row fr-grid-row--middle fr-gap-1w">
                  <button
                    type="button"
                    className="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
                    onClick={() => setShowRenameForm(true)}
                    disabled={loading}
                  >
                    Renommer
                  </button>
                  <button
                    type="button"
                    className="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
                    onClick={() => setShowAddMembersForm(true)}
                    disabled={loading}
                  >
                    Ajouter des membres
                  </button>
                </div>
              </div>
            )}
          </div>

          {isAdmin && (
            <AddUser
              groupId={group.id}
              addNewUser={addNewUser}
              cancel={() => null}
            />
          )}
          {isAdmin && (
            <UpdateName
              groupId={group.id}
              updateName={updateName}
              cancel={() => null}
            />
          )}

          <FullTable
            head={['Membre', 'Rôle', 'Action']}
            body={group.users.map((user) => [
              user.email,
              isAdmin ? (
                <select
                  className="fr-select"
                  value={getCurrentRoleId(user.role_name)}
                  onChange={(e) =>
                    handleUpdate(user.email)(parseInt(e.target.value))
                  }
                  disabled={loading}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              ) : user.role_name === adminRoleName ? (
                <span className="fr-badge fr-badge--new">{user.role_name}</span>
              ) : (
                <span className="fr-badge">{user.role_name}</span>
              ),
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
              </button>,
            ])}
          />
        </div>
      </div>
    </div>
  );
}
