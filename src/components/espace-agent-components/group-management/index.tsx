import { useState } from "react";
import type { IRolesDataRoles } from "#/clients/roles-data/interface";
import { useAuth } from "#/contexts/auth.context";
import type { IAgentsGroup } from "#/models/authentication/group";
import { GroupItem } from "./group-item";

export function GroupManagement({
  roles,
  initialGroups,
}: {
  roles: IRolesDataRoles[];
  initialGroups: IAgentsGroup[];
}) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<IAgentsGroup[]>(initialGroups);

  if (!user || groups.length === 0) {
    return <div>Aucun groupe</div>;
  }

  return groups.map((group) => {
    const currentUserRole = group.users.find(
      (groupUser) => groupUser.email === user.email
    );
    const isAdmin = Boolean(currentUserRole?.is_admin);
    const setGroup = (group: IAgentsGroup) => {
      setGroups(groups.map((g) => (g.id === group.id ? group : g)));
    };
    const deleteGroup = (groupId: number) => {
      setGroups(groups.filter((g) => g.id !== groupId));
    };

    return (
      <GroupItem
        currentUserEmail={user.email}
        deleteGroup={deleteGroup}
        group={group}
        isAdmin={isAdmin}
        key={group.id}
        roles={roles}
        setGroup={setGroup}
      />
    );
  });
}
