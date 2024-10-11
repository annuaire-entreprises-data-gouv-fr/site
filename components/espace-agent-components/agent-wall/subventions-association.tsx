import { IUniteLegale } from '#models/core/types';
import { PropsWithChildren } from 'react';
import AgentWall from '.';

const AgentWallSubventionsAssociation: React.FC<
  PropsWithChildren<{
    title: string;
    id: string;
    uniteLegale: IUniteLegale;
  }>
> = ({ uniteLegale, id, title }) => <AgentWall id={id} title={title} />;

export default AgentWallSubventionsAssociation;
