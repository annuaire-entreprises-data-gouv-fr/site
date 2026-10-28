import type { IAgentsGroup } from "#/models/authentication/group";
import { GroupCard } from "./group-card";

export function GroupManagement({
  groups,
  onGroupChange,
}: {
  groups: IAgentsGroup[];
  // reloads the groups after an update
  onGroupChange: () => void;
}) {
  if (groups.length === 0) {
    return <div>Aucun groupe</div>;
  }

  return groups.map((group) => (
    <GroupCard
      group={group}
      key={group.id}
      updateGroupNameState={onGroupChange}
    />
  ));
}
