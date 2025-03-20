'use client';

import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Loader } from '#components-ui/loader';
import { Select } from '#components-ui/select';
import { Tag } from '#components-ui/tag';
import NonRenseigne from '#components/non-renseigne';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { isAPI404 } from '#models/api-not-responding';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { hasAnyError, isDataLoading } from '#models/data-fetching';
import { UseCase } from '#models/use-cases';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { ChangeEvent, Fragment, useMemo, useState } from 'react';

const InnerLiassesSection = ({
  uniteLegale,
  session,
  selectedYear,
  useCase,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  selectedYear: string;
  useCase: UseCase;
}) => {
  const params = useMemo(
    () => ({
      params: { year: selectedYear, useCase },
    }),
    [selectedYear, useCase]
  );

  const liassesFiscalesProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentLiassesFiscalesProtected,
    uniteLegale.siren,
    session,
    params
  );

  if (isDataLoading(liassesFiscalesProtected)) {
    return <Loader />;
  }

  if (isAPI404(liassesFiscalesProtected)) {
    return (
      <i>
        Aucune liasse fiscale n’a été retrouvé pour cette structure en{' '}
        {selectedYear}
      </i>
    );
  }

  if (hasAnyError(liassesFiscalesProtected)) {
    return (
      <i>Impossible de télécharger les données pour l’année {selectedYear}</i>
    );
  }

  return (
    <>
      <div>
        <strong>Liasse fiscale {selectedYear}</strong>
      </div>
      <div>
        {liassesFiscalesProtected.obligationsFiscales.map((obl) => (
          <Tag key={obl}>{obl}</Tag>
        ))}
      </div>

      {liassesFiscalesProtected.declarations.map(
        ({ imprime, dateFinExercice, donnees }, index) => (
          <Fragment key={`${imprime}-${index}`}>
            <HorizontalSeparator />
            <TwoColumnTable
              firstColumnWidth="70%"
              body={[
                ['N° d’Imprimé', imprime],
                ['Date de fin d’exercice', dateFinExercice],
                ...donnees.map((d) => [
                  d.intitule,
                  d.valeurs.length <= 1 ? (
                    d.valeurs
                  ) : (
                    <ul>
                      {d.valeurs.map((v, index) => (
                        <li key={`${v}-${index}`}>{v || <NonRenseigne />}</li>
                      ))}
                    </ul>
                  ),
                ]),
              ]}
            />
          </Fragment>
        )
      )}
    </>
  );
};

export default function ProtectedLiassesFiscalesSection({
  uniteLegale,
  session,
  useCase,
  title,
  id,
  sources,
  isProtected,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  useCase: UseCase;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
}) {
  const [selectedYear, setSelectedYear] = useState<null | string>(null);

  const options = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const year = new Date().getFullYear() - 1 - i;
        return { value: year.toString(), label: year.toString() };
      }),
    []
  );

  return (
    <Section title={title} id={id} isProtected={isProtected} sources={sources}>
      <>
        <Select
          options={options}
          placeholder="Sélectionnez une année"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSelectedYear(e.target.value)
          }
        />
        {selectedYear ? (
          <InnerLiassesSection
            uniteLegale={uniteLegale}
            selectedYear={selectedYear}
            session={session}
            useCase={useCase}
          />
        ) : (
          <i>Sélectionnez une année pour voir sa liasse fiscale.</i>
        )}
      </>
    </Section>
  );
}
