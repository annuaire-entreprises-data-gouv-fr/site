import { IDRolesRoles, IDRolesUser } from '#clients/roles-data/interface';
import { showError, showSuccess } from '#hooks/use-notifications';
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
  const [optimisticRoleId, setOptimisticRoleId] = useState<number | null>(null);

  const handleUpdate = async (roleId: number) => {
    setLoading(true);
    setError(null);
    setOptimisticRoleId(roleId);

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
      setOptimisticRoleId(null);
      
      // Show success notification
      const roleName = roles.find(r => r.id === roleId)?.role_name || 'utilisateur';
      showSuccess(
        'Rôle mis à jour',
        `Le rôle de ${user.email} a été changé vers "${roleName}"`
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setError(errorMessage);
      setOptimisticRoleId(null);
      showError('Erreur lors de la mise à jour du rôle', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p className="fr-error-text">{error}</p>}
      <select
        className="fr-select"
        value={optimisticRoleId ?? user.role_id}
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
