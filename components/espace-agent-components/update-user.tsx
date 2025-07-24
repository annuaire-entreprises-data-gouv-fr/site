import { IDRolesRoles } from '#clients/api-d-roles/interface';
import httpClient from '#utils/network';
import { useState } from 'react';

export default function UpdateUserSelect({
  userEmail,
  roleId,
  groupId,
  roles,
  updateUser,
}: {
  userEmail: string;
  roleId: number;
  groupId: number;
  roles: IDRolesRoles[];
  updateUser: (user: { email: string; roleId: number }) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = (userEmail: string) => async (roleId: number) => {
    setLoading(true);
    setError(null);

    try {
      await httpClient({
        url: `/api/groups/${groupId}/update-user`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ userEmail, roleId }),
      });

      updateUser({ email: userEmail, roleId });
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
        value={roleId}
        onChange={(e) => handleUpdate(userEmail)(parseInt(e.target.value))}
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
