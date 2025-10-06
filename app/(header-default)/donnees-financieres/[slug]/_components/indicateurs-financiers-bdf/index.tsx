"use client";

import { DataSectionClient } from "#components/section/data-section";
import ProtectedSectionWithUseCase from "#components/section-with-use-case";
import { EAdministration } from "#models/administrations/EAdministration";
import { ApplicationRights } from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { UseCase } from "#models/use-cases";
import { ProtectedIndicateursFinanciersBDF } from "./protected-indicateurs-financiers-bdf";

export function IndicateursFinanciersBDF({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const isMoreThanThreeYearsOld =
    new Date(
      uniteLegale.dateDebutActivite || uniteLegale.dateCreation
    ).getFullYear() +
      3 <=
    new Date().getFullYear();

  if (!isMoreThanThreeYearsOld) {
    return (
      <DataSectionClient
        data={null}
        id="indicateurs-financiers-banque-de-france"
        isProtected
        sources={[EAdministration.BANQUE_DE_FRANCE]}
        title="Indicateurs financiers de la Banque de France"
      >
        {() => (
          <p>
            La Banque de France ne transmet ses indicateurs financiers qu’à la
            condition que l’entreprise ait publié au moins trois bilans.
            <br />
            Hors cette entreprise a moins de trois ans d’existence.
          </p>
        )}
      </DataSectionClient>
    );
  }

  return (
    <ProtectedSectionWithUseCase
      allowedUseCases={[UseCase.fraude]}
      id="indicateurs-financiers-banque-de-france"
      requiredRight={ApplicationRights.bilansBDF}
      session={session}
      sources={[EAdministration.BANQUE_DE_FRANCE]}
      title="Indicateurs financiers de la Banque de France"
      uniteLegale={uniteLegale}
      WrappedSection={ProtectedIndicateursFinanciersBDF}
    />
  );
}
