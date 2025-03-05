'use client';

import { Tag } from '#components-ui/tag';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { ISession } from '#models/authentication/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

const SuperAgentListSection: React.FC<{
  session: ISession | null;
}> = ({ session }) => {
  const list = useAPIRouteData(
    APIRoutesPaths.Admin,
    'super-agent-list',
    session
  );

  return (
    <AsyncDataSectionClient
      title="Liste des agents possédant des droits nominatifs"
      id={'super-agent-list'}
      isProtected={true}
      sources={[]}
      data={list}
    >
      {(list) => (
        <>
          <FullTable
            head={['Email', 'Scopes']}
            body={Object.entries(list).map(([key, values]) => {
              return [key, values.map((v) => <Tag>{v}</Tag>)];
            })}
          />
        </>
      )}
    </AsyncDataSectionClient>
  );
};

export default SuperAgentListSection;
