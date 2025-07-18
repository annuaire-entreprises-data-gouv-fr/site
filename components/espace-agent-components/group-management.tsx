'use client';

import { IDRolesUser } from '#clients/api-d-roles/interface';
import { IDRolesGroup } from '#models/groups';
import { useState } from 'react';
import { GroupEntity } from './group-entity';

export function GroupManagement({
  currentUserEmail,
  roles,
  initialGroups,
}: {
  currentUserEmail: string;
  roles: IDRolesUser[];
  initialGroups: IDRolesGroup[];
}) {
  const [groups, setGroups] = useState<IDRolesGroup[]>(initialGroups);
  const adminRoleName = roles.find((r) => r.is_admin)?.role_name;

  return groups.map((group) => {
    const currentUserRole = group.users.find(
      (user) => user.email === currentUserEmail
    );
    const isAdmin = Boolean(
      adminRoleName && currentUserRole?.role_name === adminRoleName
    );
    const setGroup = (group: IDRolesGroup) => {
      setGroups(groups.map((g) => (g.id === group.id ? group : g)));
    };

    return (
      <GroupEntity
        key={group.id}
        currentUserEmail={currentUserEmail}
        group={group}
        setGroup={setGroup}
        isAdmin={isAdmin}
        roles={roles}
      />
    );
  });
}
