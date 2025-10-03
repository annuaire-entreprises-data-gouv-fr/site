import type { IRolesDataRoles, IRolesDataUser } from "#clients/roles-data/interface";
import { NotificationTypeEnum, useNotification } from "#hooks/use-notification";
import httpClient from "#utils/network";
import { useState } from "react";

export default function UpdateUserSelect({
  user,
  groupId,
  roles,
  updateUserFromGroupState,
}: {
  user: IRolesDataUser;
  groupId: number;
  roles: IRolesDataRoles[];
  updateUserFromGroupState: (user: IRolesDataUser) => void;
}) {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [optimisticRoleId, setOptimisticRoleId] = useState<number | null>(null);

  const postUpdateUser = async (roleId: number) => {
    return await httpClient<IRolesDataUser>({
      url: `/api/groups/${groupId}/update-user`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        roles.find((r) => r.id === roleId)?.role_name || "utilisateur";
      showNotification({
        type: NotificationTypeEnum.SUCCESS,
        title: "Changement pris en compte",
        message: `Le rôle de ${user.email} a été changé en "${roleName}".`,
      });
    } catch (error: any) {
      setOptimisticRoleId(null);
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Erreur lors de la mise à jour du rôle",
        message: error?.message,
      });
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
