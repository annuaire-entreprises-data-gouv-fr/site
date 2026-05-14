import { type ChangeEvent, Fragment, useMemo, useState } from "react";
import NonRenseigne from "#/components/non-renseigne";
import { Section } from "#/components/section";
import { TwoColumnTable } from "#/components/table/simple";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { Loader } from "#/components-ui/loader";
import { Select } from "#/components-ui/select";
import { Tag } from "#/components-ui/tag";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import type { EAdministration } from "#/models/administrations/EAdministration";
import { isAPI404 } from "#/models/api-not-responding";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import { hasAnyError, isDataLoading } from "#/models/data-fetching";
import type { UseCase } from "#/models/use-cases";
import { getAgentLiassesFiscalesProtectedFn } from "#/server-functions/agent/data-fetching";

const InnerLiassesSection = ({
  uniteLegale,
  user,
  selectedYear,
  useCase,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
  selectedYear: string;
  useCase: UseCase;
}) => {
  const input = useMemo(
    () => ({ siren: uniteLegale.siren, year: selectedYear, useCase }),
    [uniteLegale.siren, selectedYear, useCase]
  );

  const liassesFiscalesProtected = useServerFnData(
    getAgentLiassesFiscalesProtectedFn,
    user,
    input,
    ApplicationRights.liassesFiscales
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
  user,
  useCase,
  title,
  id,
  sources,
  isProtected,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
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
          uniteLegale={uniteLegale}
          useCase={useCase}
          user={user}
        />
      ) : (
        <i>Sélectionnez une année pour voir sa liasse fiscale.</i>
      )}
    </Section>
  );
}
