import { ReactNode } from 'react';
import NonRenseigne from '#components/non-renseigne';
import { DataSection } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/index';
import { IServicePublic } from '#models/service-public';

export default function ServicePublicSection({
  servicePublic,
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
  servicePublic: IServicePublic | IAPINotRespondingError;
}) {
  return (
    <>
      <DataSection
        title={'Service public'}
        sources={[EAdministration.DILA]}
        data={servicePublic}
        notFoundInfo={null}
      >
        {(servicePublic) => (
          <TwoColumnTable body={getTableData(servicePublic, uniteLegale)} />
        )}
      </DataSection>
    </>
  );
}

const getTableData = (
  servicePublic: IServicePublic,
  uniteLegale: IUniteLegale
) => {
  return (
    [
      ['Nom', servicePublic.nom],
      servicePublic.typeOrganisme && [
        'Type organisme',
        servicePublic.typeOrganisme,
      ],
      ['Adresse Postale', servicePublic.adressePostale],
      ['Téléphone', servicePublic.telephone],
      ['Email', servicePublic.adresseCourriel],
      servicePublic.affectationPersonne && [
        'Responsables',
        <a
          href={`/dirigeants/${uniteLegale.siren}#responsables-service-public`}
        >
          → voir les {servicePublic.affectationPersonne.length} responsable(s)
        </a>,
      ],
      [
        'Liens',
        servicePublic.liens.length && (
          <ul>
            {servicePublic.liens.map((lien) => (
              <li key={lien.valeur}>
                <a
                  href={lien.valeur}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`ouvrir ${lien.libelle}, nouvelle fenêtre`}
                >
                  {lien.libelle}
                </a>
              </li>
            ))}
          </ul>
        ),
      ],
    ].filter(Boolean) as [string, ReactNode][]
  ).map(([label, value]) => [label, value ?? <NonRenseigne />]);
};
