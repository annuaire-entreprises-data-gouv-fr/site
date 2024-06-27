'use client';

import { PrintNever } from '#components-ui/print-visibility';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import Conformite from './conformite';

interface IProps {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}
function ConformiteSection({ uniteLegale, session }: IProps) {
  const conformite = useAPIRouteData(
    'espace-agent/conformite',
    uniteLegale.siege.siret,
    session
  );

  return (
    <PrintNever>
      <AsyncDataSectionClient
        title="Conformité"
        id="conformite"
        isProtected
        data={conformite}
        sources={[
          EAdministration.DGFIP,
          EAdministration.URSSAF,
          EAdministration.MSA,
        ]}
      >
        {(conformite) => (
          <TwoColumnTable
            body={[
              ['Conformité fiscale', <Conformite data={conformite?.fiscale} />],
              [
                'Conformité sociale',
                <>
                  <Conformite
                    data={conformite?.vigilance}
                    administration="Urssaf"
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
