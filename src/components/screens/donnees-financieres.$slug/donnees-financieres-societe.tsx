import { DonneesPriveesSection } from "#/components/donnees-privees-section";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { estDiffusible } from "#/models/core/diffusion";
import {
  type IUniteLegale,
  isEntrepreneurIndividuel,
  isServicePublic,
} from "#/models/core/types";
import { AidesADEME } from "./aides-ademe";
import { AidesMinimis } from "./aides-minimis";
import { BilansDocumentsSociete } from "./bilans-documents-societe";
import { ComptesBodaccSociete } from "./comptes-bodacc-societe";
import { FinancesSocieteSummary } from "./finances-societe-summary";
import { IndicateursFinanciers } from "./indicateurs-financiers";
import { IndicateursFinanciersBDF } from "./indicateurs-financiers-bdf";
import { LiassesFiscales } from "./liasses-fiscales";

export default function DonneesFinancieresSociete({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) {
  const shouldShowOnlyAides =
    isServicePublic(uniteLegale) || isEntrepreneurIndividuel(uniteLegale);

  return (
    <>
      <FinancesSocieteSummary
        shouldShowOnlyAides={shouldShowOnlyAides}
        uniteLegale={uniteLegale}
        user={user}
      />
      {!shouldShowOnlyAides && (
        <>
          {estDiffusible(uniteLegale) ||
          hasRights({ user }, ApplicationRights.nonDiffusible) ? (
            <IndicateursFinanciers uniteLegale={uniteLegale} user={user} />
          ) : (
            <DonneesPriveesSection title="Indicateurs financiers" />
          )}
          {hasRights({ user }, ApplicationRights.bilansBDF) && (
            <>
              <HorizontalSeparator />
              <IndicateursFinanciersBDF uniteLegale={uniteLegale} user={user} />
            </>
          )}
          <BilansDocumentsSociete uniteLegale={uniteLegale} user={user} />
          <HorizontalSeparator />
          <ComptesBodaccSociete uniteLegale={uniteLegale} />
          <LiassesFiscales uniteLegale={uniteLegale} user={user} />
        </>
      )}
      <AidesMinimis uniteLegale={uniteLegale} user={user} />
      <AidesADEME uniteLegale={uniteLegale} />
    </>
  );
}
