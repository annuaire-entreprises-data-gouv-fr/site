'use client';

import InpiPartiallyDownWarning from '#components-ui/alerts-with-explanations/inpi-partially-down';
import { Tag } from '#components-ui/tag';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export const ObservationsRNE: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const observations = useAPIRouteData(
    APIRoutesPaths.Observations,
    uniteLegale.siren,
    session
  );

  return (
    <AsyncDataSectionClient
      id="observations-rne"
      title="Observations au RNE"
      sources={[EAdministration.INPI]}
      data={observations}
      notFoundInfo={
        <>
          Cette structure ne possède pas de fiche d’immatriculation au{' '}
          <strong>Registre National des Entreprises (RNE)</strong>.
        </>
      }
    >
      {({ data, metadata }) =>
        data.length > 0 ? (
          <>
            {metadata.isFallback && <InpiPartiallyDownWarning />}
            <p>
              Cette structure possède {data.length} observation(s) au{' '}
              <strong>RNE</strong>
              &nbsp;:
            </p>
            <FullTable
              head={['Date d’ajout', 'Numéro d’observation', 'Description']}
              body={data.map((o) => [
                o.dateAjout,
                o.numObservation ? <Tag>{o.numObservation}</Tag> : '',
                o.description,
              ])}
            />
          </>
        ) : (
          <>
            Cette structure ne possède pas d’observations au{' '}
            <strong>Registre National des Entreprises (RNE)</strong>.
          </>
        )
      }
    </AsyncDataSectionClient>
  );
};
