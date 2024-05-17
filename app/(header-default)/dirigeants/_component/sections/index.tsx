import BreakPageForPrint from '#components-ui/print-break-page';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import { estDiffusible } from '#models/core/statut-diffusion';
import { IUniteLegale } from '#models/core/types';
import { getMandatairesRCS } from '#models/espace-agent/mandataires-rcs';
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
  if (
    !estDiffusible(uniteLegale) &&
    !hasRights(session, EScope.nonDiffusible)
  ) {
    return <DonneesPriveesSection />;
  }

  const [immatriculationRNE, mandatairesRCS] = await Promise.all([
    getImmatriculationRNE(uniteLegale.siren),
    hasRights(session, EScope.mandatairesRCS) &&
      getMandatairesRCS(uniteLegale.siren, session?.user?.siret),
  ]);

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
      {mandatairesRCS && (
        <MandatairesRCSSection
          immatriculationRNE={immatriculationRNE}
          uniteLegale={uniteLegale}
          mandatairesRCS={mandatairesRCS}
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
