'use client';

import NonRenseigne from '#components/non-renseigne';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IServicePublic } from '#models/service-public';
import { useFetchServicePublicSubServices } from 'hooks/fetch/service-public-subservices';

function SubServicesDataSection({
  servicePublic,
  uniteLegale,
}: {
  servicePublic: IServicePublic;
  uniteLegale: IUniteLegale;
}) {
  const subServices = useFetchServicePublicSubServices(
    servicePublic,
    uniteLegale
  );

  return (
    <DataSectionClient
      id="subservices-service-public"
      title="Département(s)"
      sources={[EAdministration.DILA]}
      data={subServices}
    >
      {(subServices) => (
        <>
          <p>
            Ce service public se compose de {subServices.length} départements :
          </p>
          <FullTable
            head={['Nom du département', 'Équipe dirigeante']}
            body={subServices.map((service) => {
              return [
                service.urlServicePublic ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Voir ${service.nom}, nouvelle fenêtre`}
                    href={service.urlServicePublic}
                  >
                    {service.nom}
                  </a>
                ) : (
                  service.nom
                ),
                service.affectationPersonne?.length === 0 ? (
                  <NonRenseigne />
                ) : service?.affectationPersonne &&
                  service?.affectationPersonne.length > 0 ? (
                  service?.affectationPersonne.map((personne, index) => (
                    <>
                      {index !== 0 && ', '}
                      <b>{personne.nom}</b> {personne.fonction}
                    </>
                  ))
                ) : (
                  <NonRenseigne />
                ),
              ];
            })}
          />
        </>
      )}
    </DataSectionClient>
  );
}

export default function SubServicesSection({
  servicePublic,
  uniteLegale,
}: {
  servicePublic: IServicePublic | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
}) {
  if (
    isAPINotResponding(servicePublic) ||
    servicePublic.subServicesId?.length === 0
  ) {
    return null;
  }

  return (
    <SubServicesDataSection
      servicePublic={servicePublic}
      uniteLegale={uniteLegale}
    />
  );
}
