"use client";

import { useFetchAlimConfiance } from "hooks/fetch/alim-confiance";
import { useCallback, useId, useState } from "react";
import { Link } from "#components/Link";
import LocalPageCounter from "#components/search-results/results-pagination/local-pagination";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import { Tag } from "#components-ui/tag";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import { formatDate, formatSiret } from "#utils/helpers";

type IProps = {
  uniteLegale: IUniteLegale;
};

/**
 * Alim'Confiance section
 */
export default function AlimConfianceSection({ uniteLegale }: IProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const alimConfiance = useFetchAlimConfiance(uniteLegale, currentPage);
  const id = useId();

  const onChangePage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    [id]
  );

  return (
    <AsyncDataSectionClient
      data={alimConfiance}
      id="alim-confiance"
      isProtected={false}
      notFoundInfo={
        <p>
          Nous n’avons pas trouvé de résultat de contrôle sanitaire pour cette
          structure.
        </p>
      }
      sources={[EAdministration.MAA]}
      title="Dispositif d‘information Alim‘confiance"
    >
      {(alimConfiance) => {
        const { total, page_size } = alimConfiance.meta;
        const plural = total > 1 ? "s" : "";

        return (
          <>
            <div id={id}>
              <p>
                Cette structure possède {total} établissement
                {plural} ayant fait l‘objet d‘un contrôle sanitaire :
              </p>

              <FullTable
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
                        <Link href={`/etablissement/${siret}`}>
                          {formatSiret(siret)}
                        </Link>
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
                        code === 4
                          ? "error"
                          : code === 3
                            ? "warning"
                            : code === 2
                              ? "info"
                              : "success"
                      }
                    >
                      {syntheseEvaluation}
                    </Tag>,
                    <div>{formatDate(dateInspection)}</div>,
                    <div>
                      {libelleActiviteEtablissement.split("|").join(", ")}
                    </div>,
                  ]
                )}
                columnWidths={["40%", "20%", "25%", "15%"]}
                head={[
                  "Détail de l'établissement",
                  "Résultat de l'évaluation",
                  "Date d'inspection",
                  "Type d'activité",
                ]}
              />
              {total > 20 && (
                <LocalPageCounter
                  compact={true}
                  currentPage={currentPage}
                  onPageChange={onChangePage}
                  totalPages={Math.ceil(total / page_size)}
                />
              )}
            </div>
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}
