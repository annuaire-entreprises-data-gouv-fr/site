'use client';

import { PrintNever } from '#components-ui/print-visibility';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/user/agent';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { useMemo } from 'react';
import Conformite from './conformite';

interface IProps {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  useCase: UseCase;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
}

function ConformiteSection({
  uniteLegale,
  session,
  useCase,
  title,
  id,
  sources,
  isProtected,
}: IProps) {
  const params = useMemo(
    () => ({
      params: { useCase },
    }),
    [useCase]
  );
  const conformite = useAPIRouteData(
    APIRoutesPaths.EspaceAgentConformite,
    uniteLegale.siege.siret,
    session,
    params
  );

  return (
    <PrintNever>
      <AsyncDataSectionClient
        title={title}
        id={id}
        isProtected={isProtected}
        sources={sources}
        data={conformite}
      >
        {(conformite) => (
          <TwoColumnTable
            body={[
              [
                'Conformité fiscale',
                <Conformite
                  data={conformite?.fiscale}
                  administration="DGFiP"
                />,
              ],
              [
                'Conformité sociale',
                <>
                  <Conformite
                    data={conformite?.vigilance}
                    administration="URSSAF"
                  />
                  <br />
                  <Conformite data={conformite?.msa} administration="MSA" />
                </>,
              ],
            ]}
          />
        )}
      </AsyncDataSectionClient>
    </PrintNever>
  );
}

export default ConformiteSection;
