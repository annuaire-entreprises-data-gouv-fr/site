import BreakPageForPrint from '#components-ui/print-break-page';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import { estDiffusible } from '#models/core/statut-diffusion';
import { IUniteLegale } from '#models/core/types';
import getImmatriculationRNE from '#models/immatriculation/rne';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import BeneficiairesSection from './beneficiaires';
import MandatairesRCSSection from './mandataires-rcs';
import DirigeantsSection from './rne-dirigeants';
import DirigeantSummary from './summary';

export async function DirigeantInformation({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const immatriculationRNE = await getImmatriculationRNE(uniteLegale.siren);

  if (
    !estDiffusible(uniteLegale) &&
    !hasRights(session, EScope.nonDiffusible)
  ) {
    return <DonneesPriveesSection />;
  }
  return (
    <>
      <DirigeantSummary
        uniteLegale={uniteLegale}
        immatriculationRNE={immatriculationRNE}
      />
      <DirigeantsSection
        uniteLegale={uniteLegale}
        immatriculationRNE={immatriculationRNE}
      />
      {hasRights(session, EScope.mandatairesRCS) && (
        <MandatairesRCSSection
          session={session}
          immatriculationRNE={immatriculationRNE}
          uniteLegale={uniteLegale}
        />
      )}

      <BreakPageForPrint />
      <BeneficiairesSection
        immatriculationRNE={immatriculationRNE}
        uniteLegale={uniteLegale}
      />
    </>
  );
}
