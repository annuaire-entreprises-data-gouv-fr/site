'use client';

import FAQLink from '#components-ui/faq-link';
import { Select } from '#components-ui/select';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { ChangeEvent, useMemo, useState } from 'react';

export const FinancesSocieteLiassesFiscalesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear - 1);

  const options = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - i;
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
      sources={[EAdministration.MEF]}
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
};
