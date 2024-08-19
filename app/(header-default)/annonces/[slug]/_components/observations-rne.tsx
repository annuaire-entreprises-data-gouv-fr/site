'use client';

import { Tag } from '#components-ui/tag';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export const ObservationsRNE: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const immatriculationRNE = useAPIRouteData('rne', uniteLegale.siren, session);

  return (
    <AsyncDataSectionClient
      id="observations-rne"
      title="Observations au RNE"
      sources={[EAdministration.INPI]}
      data={immatriculationRNE}
      notFoundInfo={
        <>
          Cette structure ne possède pas de fiche d’immatriculation au{' '}
          <strong>Registre National des Entreprises (RNE)</strong>.
        </>
      }
    >
      {(immatriculationRNE) =>
        immatriculationRNE.observations &&
        immatriculationRNE.observations.length > 0 ? (
          <>
            <br />
            <p>
              Cette structure possède également{' '}
              {immatriculationRNE.observations.length} observation(s) au{' '}
              <strong>RNE</strong>
              &nbsp;:
            </p>
            <FullTable
              head={['Date d’ajout', 'Numéro d’observation', 'Description']}
              body={immatriculationRNE.observations.map((o) => [
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
