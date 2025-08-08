import { IDRolesRoles, IDRolesUser } from '#clients/roles-data/interface';
import {
  showErrorNotification,
  showSuccessNotification,
} from '#components/notification-center';
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
  const [loading, setLoading] = useState(false);
  const [optimisticRoleId, setOptimisticRoleId] = useState<number | null>(null);

  const postUpdateUser = async (roleId: number) => {
    return await httpClient<IDRolesUser>({
      url: `/api/groups/${groupId}/update-user`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ userEmail: user.email, roleId }),
    });
  };

  const handleUpdate = async (roleId: number) => {
    setLoading(true);
    setOptimisticRoleId(roleId);

    try {
      const updatedUser = await postUpdateUser(roleId);
      updateUserFromGroupState(updatedUser);
      setOptimisticRoleId(null);

      // Show success notification
      const roleName =
        roles.find((r) => r.id === roleId)?.role_name || 'utilisateur';
      showSuccessNotification(
        'Changements pris en compte',
        `Le rôle de ${user.email} a été changé en "${roleName}"`
      );
    } catch (error: any) {
      setOptimisticRoleId(null);
      showErrorNotification(
        'Erreur lors de la mise à jour du rôle',
        error?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
