'use client';

import ProtectedSectionWithUseCase from '#components/section-with-use-case';
import { EAdministration } from '#models/administrations/EAdministration';
import { ApplicationRights } from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/use-cases';
import ProtectedLiassesFiscalesSection from './protected-liasses-fiscales-section';

export default function LiassesFiscalesSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  return (
    <ProtectedSectionWithUseCase
      session={session}
      uniteLegale={uniteLegale}
      title="Liasses Fiscales"
      id="liasses-fiscales"
      sources={[EAdministration.DGFIP]}
      allowedUseCases={[UseCase.fraude]}
      requiredRight={ApplicationRights.liassesFiscales}
      WrappedSection={ProtectedLiassesFiscalesSection}
    />
  );
}
