'use client';

import LocalPageCounter from '#components/search-results/results-pagination/local-pagination';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { useFetchBilanGes } from 'hooks/fetch/bilan-ges';
import { useState } from 'react';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const formatEmissions = (value: number): string => {
  if (value === 0) return 'Non renseigné';
  return value.toLocaleString('fr-FR');
};

/**
 * Bilan GES section
 */
export default function BilanGesSection({ uniteLegale, session }: IProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const bilanGes = useFetchBilanGes(uniteLegale, currentPage);

  return (
    <AsyncDataSectionClient
      title="Bilans GES (Gaz à Effet de Serre)"
      sources={[EAdministration.ADEME]}
      data={bilanGes}
      id="bilan-ges"
      notFoundInfo={
        <p>
          Nous n‘avons pas trouvé de bilan GES (Gaz à Effet de Serre) pour cette
          structure.
        </p>
      }
    >
      {(bilanGes) => {
        const { total } = bilanGes.meta;
        const plural = total > 1 ? 's' : '';
        const pageSize = 20;

        const sortedBilans = [...bilanGes.data].sort(
          (a, b) => b.anneeReporting - a.anneeReporting
        );

        return (
          <>
            <p>
              Cette structure a publié {total} bilan{plural} GES (Gaz à Effet de
              Serre) :
            </p>

            {total > pageSize && (
              <LocalPageCounter
                currentPage={currentPage}
                totalPages={Math.ceil(total / pageSize)}
                onPageChange={setCurrentPage}
                compact={true}
              />
            )}

            <FullTable
              head={[
                'Indicateur',
                ...sortedBilans.map((bilan) => bilan.anneeReporting.toString()),
              ]}
              body={[
                [
                  'Total des émissions (tCO2e)',
                  ...sortedBilans.map((bilan) =>
                    formatEmissions(bilan.totalEmissions)
                  ),
                ],
              ]}
            />

            {total > pageSize && (
              <LocalPageCounter
                currentPage={currentPage}
                totalPages={Math.ceil(total / pageSize)}
                onPageChange={setCurrentPage}
                compact={true}
              />
            )}
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}
