import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import BreakPageForPrint from "#components-ui/print-break-page";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import {
  type IUniteLegale,
  isEntrepreneurIndividuel,
} from "#models/core/types";
import LiensCapitalistiquesSection from "../../liens-capitalistiques";
import BeneficiairesSection from "./beneficiaires";
import DirigeantsSection from "./dirigeants-open/section";
import DirigeantsSectionProtected from "./dirigeants-protected/section";

export default function DirigeantsEntrepriseSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  return (
    <>
      {hasRights(session, ApplicationRights.mandatairesRCS) ? (
        <DirigeantsSectionProtected uniteLegale={uniteLegale} />
      ) : (
        <DirigeantsSection session={session} uniteLegale={uniteLegale} />
      )}
      <BreakPageForPrint />
      {!isEntrepreneurIndividuel(uniteLegale) &&
        hasRights(session, ApplicationRights.liensCapitalistiques) && (
          <>
            <HorizontalSeparator />
            <LiensCapitalistiquesSection
              session={session}
              uniteLegale={uniteLegale}
            />
          </>
        )}
      <HorizontalSeparator />
      <BeneficiairesSection session={session} uniteLegale={uniteLegale} />
    </>
  );
}
