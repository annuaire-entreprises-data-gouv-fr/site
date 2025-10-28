"use client";

import { useState } from "react";
import type { IRolesDataRoles } from "#clients/roles-data/interface";
import type {
  AgentsGroup,
  IRolesDataGroup,
} from "#models/authentication/group";
import { GroupItem } from "./group-item";

export function GroupManagement({
  currentUserEmail,
  roles,
  initialGroups,
}: {
  currentUserEmail: string;
  roles: IRolesDataRoles[];
  initialGroups: AgentsGroup[];
}) {
  const [groups, setGroups] = useState<IRolesDataGroup[]>(
    initialGroups.map((g) => g.data)
  );

  if (groups.length === 0) {
    return <div>Aucun groupe</div>;
  }

  return groups.map((group) => {
    const currentUserRole = group.users.find(
      (user) => user.email === currentUserEmail
    );
    const isAdmin = Boolean(currentUserRole?.is_admin);
    const setGroup = (group: IRolesDataGroup) => {
      setGroups(groups.map((g) => (g.id === group.id ? group : g)));
    };
    const deleteGroup = (groupId: number) => {
      setGroups(groups.filter((g) => g.id !== groupId));
    };

    return (
      <GroupItem
        currentUserEmail={currentUserEmail}
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
