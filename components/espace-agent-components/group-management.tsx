'use client';

import { IDRolesUser } from '#clients/api-d-roles/interface';
import { IDRolesGroup } from '#models/groups';
import { useEffect, useState } from 'react';
import { GroupEntity } from './group-entity';

export function GroupManagement({
  currentUserEmail,
  currentUserSub,
}: {
  currentUserEmail: string;
  currentUserSub: string;
}) {
  const [groups, setGroups] = useState<IDRolesGroup[]>([]);
  const [roles, setRoles] = useState<IDRolesUser[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);

  const adminRoleName = roles.find((r) => r.is_admin)?.role_name;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/groups/roles');
        if (response.ok) {
          const rolesData = await response.json();
          setRoles(rolesData);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setRolesLoading(false);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        if (response.ok) {
          const groupsData = await response.json();
          setGroups(groupsData);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setGroupsLoading(false);
      }
    };

    fetchRoles();
    fetchGroups();
  }, [currentUserEmail, currentUserSub]);

  if (rolesLoading || groupsLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      {groups.map((group) => {
        const currentUserRole = group.users.find(
          (user) => user.email === currentUserEmail
        );
        const isAdmin = Boolean(
          adminRoleName && currentUserRole?.role_name === adminRoleName
        );

        return (
          <GroupEntity
            key={group.id}
            group={group}
            setGroup={(group: IDRolesGroup) =>
              setGroups(groups.map((g) => (g.id === group.id ? group : g)))
            }
            isAdmin={isAdmin}
            roles={roles}
          />
        );
      })}
    </>
  );
}
