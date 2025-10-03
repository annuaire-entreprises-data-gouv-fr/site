"use client";

import { IRolesDataRoles } from "#clients/roles-data/interface";
import { IRolesDataGroup } from "#models/authentication/group/groups";
import { useState } from "react";
import { GroupItem } from "./group-item";

export function GroupManagement({
  currentUserEmail,
  roles,
  initialGroups,
}: {
  currentUserEmail: string;
  roles: IRolesDataRoles[];
  initialGroups: IRolesDataGroup[];
}) {
  const [groups, setGroups] = useState<IRolesDataGroup[]>(initialGroups);

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
        key={group.id}
        currentUserEmail={currentUserEmail}
        group={group}
        setGroup={setGroup}
        deleteGroup={deleteGroup}
        isAdmin={isAdmin}
        roles={roles}
      />
    );
  });
}
