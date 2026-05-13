import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import BreakPageForPrint from "#/components-ui/print-break-page";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import {
  type IUniteLegale,
  isEntrepreneurIndividuel,
} from "#/models/core/types";
import LiensCapitalistiquesSection from "../../liens-capitalistiques";
import BeneficiairesSection from "./beneficiaires";
import DirigeantsSection from "./dirigeants-open/section";
import DirigeantsSectionProtected from "./dirigeants-protected/section";

export default function DirigeantsEntrepriseSection({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) {
  return (
    <>
      {hasRights({ user }, ApplicationRights.mandatairesRCS) ? (
        <DirigeantsSectionProtected uniteLegale={uniteLegale} user={user} />
      ) : (
        <DirigeantsSection uniteLegale={uniteLegale} user={user} />
      )}
      <BreakPageForPrint />
      {!isEntrepreneurIndividuel(uniteLegale) &&
        hasRights({ user }, ApplicationRights.liensCapitalistiques) && (
          <>
            <HorizontalSeparator />
            <LiensCapitalistiquesSection
              uniteLegale={uniteLegale}
              user={user}
            />
          </>
        )}
      <HorizontalSeparator />
      <BeneficiairesSection uniteLegale={uniteLegale} user={user} />
    </>
  );
}
