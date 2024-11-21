import { IRole } from '#models/rne/types';
import React from 'react';
import DisambiguationTooltip from './DisambiguationTooltip';

export default function RolesInfos({ roles }: { roles: IRole[] }) {
  return roles && roles.length > 1 ? (
    <ul>
      {roles.map((role, index) => (
        <li key={index}>
          <span>{role.label}</span>
          <DisambiguationTooltip
            dataType="rôle"
            isInIg={role.isInIg}
            isInInpi={role.isInInpi}
          />
          {index < roles.length - 1 && <br />}
        </li>
      ))}
    </ul>
  ) : (
    <React.Fragment>
      {roles?.map((role, index) => (
        <React.Fragment key={index}>
          <span>{role.label}</span>
          <DisambiguationTooltip
            dataType="rôle"
            isInIg={role.isInIg}
            isInInpi={role.isInInpi}
          />
          {index < roles.length - 1 && <br />}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
