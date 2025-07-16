'use client';

import { FullTable } from '#components/table/full';
import { useEffect, useState } from 'react';

interface TeamUser {
  email: string;
  role_name: string;
  is_email_confirmed: boolean;
}

interface Team {
  id: number;
  name: string;
  users: TeamUser[];
}

interface Role {
  id: number;
  role_name: string;
  is_admin: boolean;
}

interface TeamManagementProps {
  groups: Team[];
  currentUserEmail: string;
}

export function TeamManagement({
  groups,
  currentUserEmail,
}: TeamManagementProps) {
  const [teams, setTeams] = useState<Team[]>(groups);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [inputEmail, setInputEmail] = useState<{ [key: string]: string }>({});

  const getCurrentRoleId = (userRoleName: string) => {
    const role = roles.find((r) => r.role_name === userRoleName);
    return role?.id || 0;
  };

  const getCurrentRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.role_name || '';
  };
  const adminRoleName = roles.find((r) => r.is_admin)?.role_name;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/teams/roles');
        if (response.ok) {
          const rolesData = await response.json();
          setRoles(rolesData);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

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

      setTeams((prev) =>
        prev.map((team) =>
          team.id === groupId ? { ...team, name: groupName } : team
        )
      );
    } catch (error) {
      console.error('Error updating team name:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
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

      setTeams((prev) =>
        prev.map((team) =>
          team.id === groupId
            ? {
                ...team,
                users: [
                  ...team.users,
                  {
                    email: userEmail,
                    role_name: getCurrentRoleName(defaultRoleId),
                    is_email_confirmed: false,
                  },
                ],
              }
            : team
        )
      );

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

        setTeams((prev) =>
          prev.map((team) =>
            team.id === groupId
              ? {
                  ...team,
                  users: team.users.map((user) =>
                    user.email === userEmail
                      ? {
                          ...user,
                          role_name:
                            roles.find((r) => r.id === roleId)?.role_name ||
                            user.role_name,
                        }
                      : user
                  ),
                }
              : team
          )
        );
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

      setTeams((prev) =>
        prev.map((team) =>
          team.id === groupId
            ? {
                ...team,
                users: team.users.filter((user) => user.email !== userEmail),
              }
            : team
        )
      );
    } catch (error) {
      console.error('Error removing user from team:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <>
      {teams.map((group) => {
        const currentUserRole = group.users.find(
          (user) => user.email === currentUserEmail
        );
        const isAdmin =
          adminRoleName && currentUserRole?.role_name === adminRoleName;

        return (
          <div key={group.id} className="fr-card">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <div
                  className="fr-grid-row fr-grid-row--gutters"
                  style={{ alignItems: 'center' }}
                >
                  <div className="fr-col">
                    <div className="fr-text--xl fr-text--bold">
                      {group.name}
                    </div>
                    <div className="fr-text--sm">
                      {group.users.length} membres
                    </div>
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
                              `add-user-${group.id}-${
                                inputEmail[group.id] || ''
                              }`
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
                  head={['Membre', 'Rôle', 'Statut', 'Action']}
                  body={group.users.map((user) => [
                    user.email,

                    rolesLoading ? (
                      <span>Chargement...</span>
                    ) : isAdmin ? (
                      <select
                        className="fr-select"
                        value={getCurrentRoleId(user.role_name)}
                        onChange={(e) =>
                          handleUpdate(
                            group.id,
                            user.email
                          )(parseInt(e.target.value))
                        }
                        disabled={
                          loading[`update-user-${group.id}-${user.email}`]
                        }
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.role_name}
                          </option>
                        ))}
                      </select>
                    ) : user.role_name === adminRoleName ? (
                      <span className="fr-badge fr-badge--new">
                        {user.role_name}
                      </span>
                    ) : (
                      <span className="fr-badge">{user.role_name}</span>
                    ),
                    user.is_email_confirmed ? (
                      <span className="fr-badge fr-badge--success">
                        Inscrit
                      </span>
                    ) : (
                      <span className="fr-badge">Invitation envoyée</span>
                    ),
                    <button
                      key={`remove-${user.email}`}
                      type="button"
                      className="fr-btn fr-btn--tertiary-no-outline"
                      title="Supprimer"
                      aria-label={`Supprimer ${user.email}`}
                      onClick={handleRemove(group.id, user.email)}
                      disabled={
                        loading[`remove-user-${group.id}-${user.email}`]
                      }
                    >
                      <span aria-hidden="true">🗑️</span>
                    </button>,
                  ])}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
