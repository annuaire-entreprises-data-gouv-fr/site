import { DonneesPriveesSection } from "#components/donnees-privees-section";
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { estDiffusible } from "#models/core/diffusion";
import type { IUniteLegale } from "#models/core/types";
import { BilansDocumentsSociete } from "./bilans-documents-societe";
import { ComptesBodaccSociete } from "./comptes-bodacc-societe";
import { FinancesSocieteSummary } from "./finances-societe-summary";
import { IndicateursFinanciers } from "./indicateurs-financiers";
import { IndicateursFinanciersBDF } from "./indicateurs-financiers-bdf";
import { LiassesFiscales } from "./liasses-fiscales";

export default function DonneesFinancieresSociete({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  return (
    <>
      <FinancesSocieteSummary session={session} />
      {estDiffusible(uniteLegale) ||
      hasRights(session, ApplicationRights.nonDiffusible) ? (
        <IndicateursFinanciers session={session} uniteLegale={uniteLegale} />
      ) : (
        <DonneesPriveesSection title="Indicateurs financiers" />
      )}
      {hasRights(session, ApplicationRights.bilansBDF) && (
        <>
          <HorizontalSeparator />
          <IndicateursFinanciersBDF
            session={session}
            uniteLegale={uniteLegale}
          />
        </>
      )}
      <BilansDocumentsSociete session={session} uniteLegale={uniteLegale} />
      <HorizontalSeparator />
      <ComptesBodaccSociete uniteLegale={uniteLegale} />
      <LiassesFiscales session={session} uniteLegale={uniteLegale} />
    </>
  );
}
