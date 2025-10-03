import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import { DonneesPriveesSection } from "#components/donnees-privees-section";
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
        <IndicateursFinanciers uniteLegale={uniteLegale} session={session} />
      ) : (
        <DonneesPriveesSection title="Indicateurs financiers" />
      )}
      {hasRights(session, ApplicationRights.bilansBDF) && (
        <>
          <HorizontalSeparator />
          <IndicateursFinanciersBDF
            uniteLegale={uniteLegale}
            session={session}
          />
        </>
      )}
      <BilansDocumentsSociete uniteLegale={uniteLegale} session={session} />
      <HorizontalSeparator />
      <ComptesBodaccSociete uniteLegale={uniteLegale} />
      <LiassesFiscales uniteLegale={uniteLegale} session={session} />
    </>
  );
}
