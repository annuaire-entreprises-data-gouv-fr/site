"use client";

import { type ChangeEvent, Fragment, useMemo, useState } from "react";
import { getAgentLiassesFiscalesProtectedAction } from "server-actions/agent/data-fetching";
import NonRenseigne from "#components/non-renseigne";
import { Section } from "#components/section";
import { TwoColumnTable } from "#components/table/simple";
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import { Loader } from "#components-ui/loader";
import { Select } from "#components-ui/select";
import { Tag } from "#components-ui/tag";
import { useServerActionData } from "#hooks/fetch/use-server-action-data";
import type { EAdministration } from "#models/administrations/EAdministration";
import { isAPI404 } from "#models/api-not-responding";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { hasAnyError, isDataLoading } from "#models/data-fetching";
import type { UseCase } from "#models/use-cases";

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
  const input = useMemo(
    () => ({ siren: uniteLegale.siren, year: selectedYear, useCase }),
    [uniteLegale.siren, selectedYear, useCase]
  );

  const liassesFiscalesProtected = useServerActionData(
    getAgentLiassesFiscalesProtectedAction,
    session,
    input
  );

  if (isDataLoading(liassesFiscalesProtected)) {
    return <Loader />;
  }

  if (isAPI404(liassesFiscalesProtected)) {
    return (
      <i>
        Aucune liasse fiscale n’a été retrouvé pour cette structure en{" "}
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
              body={[
                ["N° d’Imprimé", imprime],
                ["Date de fin d’exercice", dateFinExercice],
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
              firstColumnWidth="70%"
            />
          </Fragment>
        )
      )}
    </>
  );
};

export function ProtectedLiassesFiscales({
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

  const options = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const creationYear = new Date(uniteLegale.dateCreation).getFullYear();

    const yearsToDisplay = currentYear - creationYear + 1;

    return Array.from({ length: yearsToDisplay }, (_, i) => {
      const year = currentYear - i;
      return { value: year.toString(), label: year.toString() };
    });
  }, [uniteLegale.dateCreation]);

  return (
    <Section id={id} isProtected={isProtected} sources={sources} title={title}>
      <>
        <Select
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSelectedYear(e.target.value)
          }
          options={options}
          placeholder="Sélectionnez une année"
        />
        {selectedYear ? (
          <InnerLiassesSection
            selectedYear={selectedYear}
            session={session}
            uniteLegale={uniteLegale}
            useCase={useCase}
          />
        ) : (
          <i>Sélectionnez une année pour voir sa liasse fiscale.</i>
        )}
      </>
    </Section>
  );
}
