import { useState } from "react";
import type { IAgentsGroup } from "#/models/authentication/group";
import { GroupCard } from "./group-card";

export function GroupManagement({
  initialGroups,
}: {
  initialGroups: IAgentsGroup[];
}) {
  const [groups, setGroups] = useState<IAgentsGroup[]>(initialGroups);

  if (groups.length === 0) {
    return <div>Aucun groupe</div>;
  }

  return groups.map((group) => (
    <GroupCard
      group={group}
      key={group.id}
      updateGroupNameState={(name: string) => {
        setGroups(groups.map((g) => (g.id === group.id ? { ...g, name } : g)));
      }}
    />
  ));
}
