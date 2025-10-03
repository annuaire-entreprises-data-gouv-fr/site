"use client";

import ProtectedSectionWithUseCase from "#components/section-with-use-case";
import { DataSectionClient } from "#components/section/data-section";
import { EAdministration } from "#models/administrations/EAdministration";
import { ApplicationRights } from "#models/authentication/user/rights";
import { ISession } from "#models/authentication/user/session";
import { IUniteLegale } from "#models/core/types";
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
        title="Indicateurs financiers de la Banque de France"
        id="indicateurs-financiers-banque-de-france"
        sources={[EAdministration.BANQUE_DE_FRANCE]}
        isProtected
        data={null}
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
      session={session}
      uniteLegale={uniteLegale}
      title="Indicateurs financiers de la Banque de France"
      id="indicateurs-financiers-banque-de-france"
      sources={[EAdministration.BANQUE_DE_FRANCE]}
      allowedUseCases={[UseCase.fraude]}
      requiredRight={ApplicationRights.bilansBDF}
      WrappedSection={ProtectedIndicateursFinanciersBDF}
    />
  );
}
