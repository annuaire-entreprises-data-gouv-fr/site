import { IRole } from '#models/rne/types';
import DisambiguationTooltip from './DisambiguationTooltip';

export default function RolesInfos({ roles }: { roles: IRole[] }) {
  return roles
    .filter((role) => Boolean(role.label))
    .map((role, index) => (
      <div key={index}>
        <span>{role.label}</span>
        <DisambiguationTooltip
          dataType="rôle"
          isInIg={role.isInIg}
          isInInpi={role.isInInpi}
        />
      </div>
    ));
}
