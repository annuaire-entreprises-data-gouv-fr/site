'use client';

import { Tag } from '#components-ui/tag';
import LocalPageCounter from '#components/search-results/results-pagination/local-pagination';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { formatDate, formatSiret } from '#utils/helpers';
import { useFetchAlimConfiance } from 'hooks/fetch/alim-confiance';
import { useState } from 'react';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

/**
 * Alim'Confiance section
 */
export default function AlimConfianceSection({ uniteLegale }: IProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const alimConfiance = useFetchAlimConfiance(uniteLegale, currentPage);

  return (
    <AsyncDataSectionClient
      id="alim-confiance"
      title="Dispositif d‘information Alim‘confiance"
      sources={[EAdministration.MAA]}
      isProtected={false}
      data={alimConfiance}
      notFoundInfo={
        <p>
          Nous n’avons pas trouvé de résultat de contrôle sanitaire pour cette
          structure.
        </p>
      }
    >
      {(alimConfiance) => {
        const { total, page_size } = alimConfiance.meta;
        const plural = total > 1 ? 's' : '';

        return (
          <>
            <div>
              <p>
                Cette structure possède {total} établissement
                {plural} ayant fait l‘objet d‘un contrôle sanitaire :
              </p>

              {total > 20 && (
                <LocalPageCounter
                  currentPage={currentPage}
                  totalPages={Math.ceil(total / page_size)}
                  onPageChange={setCurrentPage}
                  compact={true}
                />
              )}

              <FullTable
                head={[
                  "Détail de l'établissement",
                  "Résultat de l'évaluation",
                  "Date d'inspection",
                  "Type d'activité",
                ]}
                columnWidths={['40%', '20%', '25%', '15%']}
                body={alimConfiance.data.map(
                  ({
                    siret,
                    denomination,
                    adresse,
                    codePostal,
                    commune,
                    libelleActiviteEtablissement,
                    dateInspection,
                    syntheseEvaluation,
                    code,
                  }) => [
                    <>
                      {siret && (
                        <a href={`/etablissement/${siret}`}>
                          {formatSiret(siret)}
                        </a>
                      )}
                      {denomination && <div>{denomination}</div>}
                      {adresse && codePostal && commune && (
                        <div>
                          {adresse} {codePostal} {commune}
                        </div>
                      )}
                    </>,
                    <Tag
                      color={
                        code === '4'
                          ? 'error'
                          : code === '3'
                          ? 'warning'
                          : code === '2'
                          ? 'info'
                          : 'success'
                      }
                    >
                      {syntheseEvaluation}
                    </Tag>,
                    <div>{formatDate(dateInspection)}</div>,
                    <div>
                      {libelleActiviteEtablissement.split('|').join(', ')}
                    </div>,
                  ]
                )}
              />
            </div>
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}
