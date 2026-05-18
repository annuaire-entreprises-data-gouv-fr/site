import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type {
  IRolesDataRoles,
  IRolesDataUser,
} from "#/clients/roles-data/interface";
import {
  NotificationTypeEnum,
  useNotification,
} from "#/hooks/use-notification";
import { updateUserRoleInGroupFn } from "#/server-functions/agent/group-management";

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
  const [optimisticRoleId, setOptimisticRoleId] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: updateUserRoleInGroupFn,
    onSuccess: (result) => {
      updateUserFromGroupState(result);
      setOptimisticRoleId(null);

      // Show success notification
      const roleName =
        roles.find((r) => r.id === result.role_id)?.role_name || "utilisateur";
      showNotification({
        type: NotificationTypeEnum.SUCCESS,
        title: "Changement pris en compte",
        message: `Le rôle de ${user.email} a été changé en "${roleName}".`,
      });
    },
    onError: (error) => {
      setOptimisticRoleId(null);
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Erreur lors de la mise à jour du rôle",
        message: error.message,
      });
    },
  });

  const handleUpdate = async (roleId: number) => {
    setOptimisticRoleId(roleId);

    mutation.mutate({ data: { groupId, userId: user.id, roleId } });
  };

  return (
    <select
      className="fr-select"
      disabled={mutation.isPending}
      onChange={(e) => handleUpdate(Number.parseInt(e.target.value, 10))}
      value={optimisticRoleId ?? user.role_id}
    >
      {roles.map((role) => (
        <option key={role.id} value={role.id}>
          {role.role_name}
        </option>
      ))}
    </select>
  );
}
