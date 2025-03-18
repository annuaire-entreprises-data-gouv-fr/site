'use client';

import FAQLink from '#components-ui/faq-link';
import { Select } from '#components-ui/select';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { ChangeEvent, useMemo, useState } from 'react';

export default function FinancesSocieteLiassesFiscalesSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear - 1);

  const options = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => {
        const year = currentYear - 1 - i;
        return { value: year.toString(), label: year.toString() };
      }),
    [currentYear]
  );
  const params = useMemo(
    () => ({
      params: { year: selectedYear },
    }),
    [selectedYear]
  );

  const liassesFiscalesProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentLiassesFiscalesProtected,
    uniteLegale.siren,
    session,
    params
  );

  return (
    <AsyncDataSectionClient
      title="Liasses Fiscales DGFIP"
      id="liasses-fiscales-dgfip"
      sources={[EAdministration.DGFIP]}
      isProtected
      data={liassesFiscalesProtected}
      notFoundInfo="Aucune liasse fiscale n’a été retrouvé pour cette structure."
    >
      {(liassesFiscales) => {
        const body = [
          ['Date de clôture', liassesFiscales[0].dateFinExercice],
          ...liassesFiscales[0].donnees.map((donnee) => [
            donnee.intitule,
            donnee.valeurs[0],
          ]),
        ];

        return (
          <>
            <Select
              options={options}
              defaultValue={selectedYear.toString()}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedYear(parseInt(e.target.value, 10));
              }}
            />
            <FullTable
              head={[
                <FAQLink
                  tooltipLabel="Indicateurs"
                  to="/faq/donnees-financieres"
                >
                  Définition des indicateurs
                </FAQLink>,
              ]}
              body={body}
            />
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}
