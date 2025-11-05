import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { updateUserRoleInGroupAction } from "server-actions/agent/group-management";
import type {
  IRolesDataRoles,
  IRolesDataUser,
} from "#clients/roles-data/interface";
import { NotificationTypeEnum, useNotification } from "#hooks/use-notification";

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

  const { execute, isPending } = useAction(updateUserRoleInGroupAction, {
    onSuccess: (result) => {
      updateUserFromGroupState(result.data);
      setOptimisticRoleId(null);

      // Show success notification
      const roleName =
        roles.find((r) => r.id === result.data.role_id)?.role_name ||
        "utilisateur";
      showNotification({
        type: NotificationTypeEnum.SUCCESS,
        title: "Changement pris en compte",
        message: `Le rôle de ${user.email} a été changé en "${roleName}".`,
      });
    },
    onError: ({ error }) => {
      setOptimisticRoleId(null);
      showNotification({
        type: NotificationTypeEnum.ERROR,
        title: "Erreur lors de la mise à jour du rôle",
        message: error.serverError?.message,
      });
    },
  });

  const handleUpdate = async (roleId: number) => {
    setOptimisticRoleId(roleId);

    execute({ groupId, userId: user.id, roleId });
  };

  return (
    <>
      <select
        className="fr-select"
        disabled={isPending}
        onChange={(e) => handleUpdate(Number.parseInt(e.target.value))}
        value={optimisticRoleId ?? user.role_id}
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
