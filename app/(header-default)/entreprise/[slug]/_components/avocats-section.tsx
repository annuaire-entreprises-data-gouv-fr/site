"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import type { IAvocats } from "#clients/api-data-gouv/avocats/interface";
import NonRenseigne from "#components/non-renseigne";
import LocalPageCounter from "#components/search-results/results-pagination/local-pagination";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import { useFetchAvocats } from "#hooks/fetch/avocats";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";

const NoAvocats = () => (
  <p>Nous n'avons pas trouvé d'avocat enregistré pour cette structure.</p>
);

const AvocatsTable = ({ avocats }: { avocats: IAvocats["avocats"] }) => (
  <FullTable
    body={avocats.map((avocat) => [
      `${avocat.prenom} ${avocat.nom}`,
      avocat.nomBarreau,
      avocat.languesParlees || <NonRenseigne />,
    ])}
    head={["Avocat", "Inscrit au barreau", "Langues parlées"]}
  />
);

export default function AvocatsSection({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) {
  const [currentPage, setCurrentPage] = useQueryState(
    "avocats-page",
    parseAsInteger.withDefault(1)
  );

  const avocats = useFetchAvocats(uniteLegale, currentPage);

  return (
    <AsyncDataSectionClient
      data={avocats}
      id="avocats"
      notFoundInfo={null}
      sources={[EAdministration.CONSEIL_NATIONAL_DES_BARREAUX]}
      title="Avocats"
    >
      {(avocats) =>
        avocats.avocats.length === 0 ? (
          <NoAvocats />
        ) : (
          <>
            <p>
              Un total de {avocats.meta.total} avocat
              {avocats.meta.total > 1 ? "s" : ""} a été retrouvé pour cette
              structure.
            </p>
            <p>
              Données issues de l’annuaire national des avocats établit par le
              Conseil national des barreaux.
            </p>
            <AvocatsTable avocats={avocats.avocats} />
            {avocats.meta.total > avocats.meta.page_size && (
              <LocalPageCounter
                compact={true}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={Math.ceil(
                  avocats.meta.total / avocats.meta.page_size
                )}
              />
            )}
          </>
        )
      }
    </AsyncDataSectionClient>
  );
}
