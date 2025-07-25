import { IDRolesRoles, IDRolesUser } from '#clients/api-d-roles/interface';
import httpClient from '#utils/network';
import { useState } from 'react';

export default function UpdateUserSelect({
  user,
  groupId,
  roles,
  updateUserFromGroupState,
}: {
  user: IDRolesUser;
  groupId: number;
  roles: IDRolesRoles[];
  updateUserFromGroupState: (user: IDRolesUser) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (roleId: number) => {
    setLoading(true);
    setError(null);

    updateUserFromGroupState({
      ...user,
      role_id: roleId,
    });

    try {
      const updatedUser = await httpClient<IDRolesUser>({
        url: `/api/groups/${groupId}/update-user`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ userEmail: user.email, roleId }),
      });

      updateUserFromGroupState(updatedUser);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p className="fr-error-text">{error}</p>}
      <select
        className="fr-select"
        value={user.role_id}
        onChange={(e) => handleUpdate(parseInt(e.target.value))}
        disabled={loading}
      >
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.role_name}
          </option>
        ))}
      </select>
    </>
  );
}
