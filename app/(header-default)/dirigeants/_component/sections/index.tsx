'use client';

import BreakPageForPrint from '#components-ui/print-break-page';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import { estDiffusible } from '#models/core/statut-diffusion';
import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { useFetchImmatriculationRNE } from 'hooks';
import useSession from 'hooks/use-session';
import BeneficiairesSection from './beneficiaires';
import DirigeantsSection from './rne-dirigeants';
import DirigeantSummary from './summary';

export function DirigeantInformation({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) {
  const immatriculationRNE = useFetchImmatriculationRNE(uniteLegale);
  const session = useSession();
  return (
    <>
      <DirigeantSummary
        uniteLegale={uniteLegale}
        immatriculationRNE={immatriculationRNE}
      />
      {estDiffusible(uniteLegale) ||
      hasRights(session, EScope.nonDiffusible) ? (
        <>
          <DirigeantsSection
            immatriculationRNE={immatriculationRNE}
            uniteLegale={uniteLegale}
          />
          <BreakPageForPrint />
          <BeneficiairesSection
            immatriculationRNE={immatriculationRNE}
            uniteLegale={uniteLegale}
          />
        </>
      ) : (
        <DonneesPriveesSection />
      )}
    </>
  );
}
