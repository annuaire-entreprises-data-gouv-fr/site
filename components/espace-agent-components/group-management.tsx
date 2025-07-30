'use client';

import { IDRolesRoles } from '#clients/roles-data/interface';
import { IDRolesGroup } from '#models/authentication/group/groups';
import { useState } from 'react';
import { GroupEntity } from './group-entity';

export function GroupManagement({
  currentUserEmail,
  roles,
  initialGroups,
}: {
  currentUserEmail: string;
  roles: IDRolesRoles[];
  initialGroups: IDRolesGroup[];
}) {
  const [groups, setGroups] = useState<IDRolesGroup[]>(initialGroups);

  if (groups.length === 0) {
    return <div>Aucune équipe trouvée</div>;
  }

  return groups.map((group) => {
    const currentUserRole = group.users.find(
      (user) => user.email === currentUserEmail
    );
    const isAdmin = Boolean(currentUserRole?.is_admin);
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
