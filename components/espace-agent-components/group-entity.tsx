import { IDRolesUser } from '#clients/api-d-roles/interface';
import { FullTable } from '#components/table/full';
import { IDRolesGroup } from '#models/groups';
import { useState } from 'react';

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
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [inputEmail, setInputEmail] = useState<{ [key: string]: string }>({});
  const [editingTeamName, setEditingTeamName] = useState<{
    [key: number]: string;
  }>({});
  const [isEditingName, setIsEditingName] = useState<{
    [key: number]: boolean;
  }>({});

  const getCurrentRoleId = (userRoleName: string) => {
    const role = roles.find((r) => r.role_name === userRoleName);
    return role?.id || 0;
  };

  const getCurrentRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.role_name || '';
  };
  const adminRoleName = roles.find((r) => r.is_admin)?.role_name;

  const handleUpdateName = (groupId: number) => async (groupName: string) => {
    const key = `update-name-${groupId}`;
    setLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(`/api/teams/${groupId}/update-name`, {
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
      setIsEditingName((prev) => ({ ...prev, [groupId]: false }));
    } catch (error) {
      console.error('Error updating team name:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const startEditingName = (groupId: number, currentName: string) => {
    setEditingTeamName((prev) => ({ ...prev, [groupId]: currentName }));
    setIsEditingName((prev) => ({ ...prev, [groupId]: true }));
  };

  const cancelEditingName = (groupId: number) => {
    setIsEditingName((prev) => ({ ...prev, [groupId]: false }));
    setEditingTeamName((prev) => ({ ...prev, [groupId]: '' }));
  };

  const saveTeamName = (groupId: number) => {
    const newName = editingTeamName[groupId];
    if (newName && newName.trim()) {
      handleUpdateName(groupId)(newName.trim());
    }
  };

  const handleAddNewUser = async (groupId: number) => {
    const currentInputEmail = inputEmail[groupId] || '';
    if (!currentInputEmail || !currentInputEmail.trim()) return;
    const userEmail = currentInputEmail.trim();
    const defaultRoleId = roles.length > 0 ? roles[0].id : 0;

    const key = `add-user-${groupId}-${userEmail}`;
    setLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(`/api/teams/${groupId}/add-user`, {
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

      setInputEmail((prev) => ({ ...prev, [groupId]: '' }));
    } catch (error) {
      console.error('Error adding user to team:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleUpdate =
    (groupId: number, userEmail: string) => async (roleId: number) => {
      const key = `update-user-${groupId}-${userEmail}`;
      setLoading((prev) => ({ ...prev, [key]: true }));

      try {
        const response = await fetch(`/api/teams/${groupId}/update-user`, {
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
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    };

  const handleRemove = (groupId: number, userEmail: string) => async () => {
    const key = `remove-user-${groupId}-${userEmail}`;
    setLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(`/api/teams/${groupId}/remove-user`, {
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
      setLoading((prev) => ({ ...prev, [key]: false }));
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
                {isEditingName[group.id] ? (
                  <div className="fr-input-group">
                    <input
                      className="fr-input"
                      type="text"
                      value={editingTeamName[group.id]}
                      onChange={(e) =>
                        setEditingTeamName((prev) => ({
                          ...prev,
                          [group.id]: e.target.value,
                        }))
                      }
                      onBlur={() => saveTeamName(group.id)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          saveTeamName(group.id);
                        }
                      }}
                      autoFocus
                    />
                    <div className="fr-mt-1w">
                      <button
                        type="button"
                        className="fr-btn fr-btn--sm fr-btn--primary"
                        onClick={() => saveTeamName(group.id)}
                        disabled={loading[`update-name-${group.id}`]}
                      >
                        Sauvegarder
                      </button>
                      <button
                        type="button"
                        className="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-ml-1w"
                        onClick={() => cancelEditingName(group.id)}
                        disabled={loading[`update-name-${group.id}`]}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="fr-grid-row fr-grid-row--middle">
                    <div className="fr-col">
                      <span
                        onClick={() =>
                          isAdmin && startEditingName(group.id, group.name)
                        }
                        style={{
                          cursor: isAdmin ? 'pointer' : 'default',
                        }}
                        className={isAdmin ? 'fr-link' : ''}
                      >
                        {group.name}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="fr-col-auto">
                        <button
                          type="button"
                          className="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
                          onClick={() => startEditingName(group.id, group.name)}
                          title="Modifier le nom de l'équipe"
                          aria-label="Modifier le nom de l'équipe"
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="fr-text--sm">{group.users.length} membres</div>
            </div>
          </div>

          {isAdmin && (
            <>
              <div className="fr-input-group">
                <label
                  className="fr-label"
                  htmlFor={`new-user-email-${group.id}`}
                >
                  Ajouter un membre
                </label>
                <div className="fr-input-wrap">
                  <input
                    className="fr-input"
                    type="email"
                    id={`new-user-email-${group.id}`}
                    placeholder="email@exemple.fr"
                    value={inputEmail[group.id] || ''}
                    onChange={(e) =>
                      setInputEmail((prev) => ({
                        ...prev,
                        [group.id]: e.target.value,
                      }))
                    }
                    disabled={
                      loading[
                        `add-user-${group.id}-${inputEmail[group.id] || ''}`
                      ]
                    }
                  />
                </div>
                <button
                  type="button"
                  className="fr-btn fr-btn--primary fr-mt-1w"
                  onClick={() => handleAddNewUser(group.id)}
                  disabled={
                    !(inputEmail[group.id] || '')?.trim() ||
                    loading[
                      `add-user-${group.id}-${inputEmail[group.id] || ''}`
                    ]
                  }
                >
                  Ajouter
                </button>
              </div>
            </>
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
                    handleUpdate(group.id, user.email)(parseInt(e.target.value))
                  }
                  disabled={loading[`update-user-${group.id}-${user.email}`]}
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
                onClick={handleRemove(group.id, user.email)}
                disabled={loading[`remove-user-${group.id}-${user.email}`]}
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
