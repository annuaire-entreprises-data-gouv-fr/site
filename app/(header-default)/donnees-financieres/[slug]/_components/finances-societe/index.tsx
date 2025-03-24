'use client';

import { DGFiP } from '#components/administrations';
import { AskUseCase } from '#components/section-with-use-case/ask-use-case';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/use-cases';
import { useState } from 'react';
import { ProtectedFinancesSocieteSection } from './finances-societe-protected';
import { PublicFinancesSocieteSection } from './finances-societe-public';

export function FinancesSocieteSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const [useCase, setUseCase] = useState<UseCase>();

  return (
    <>
      {hasRights(session, ApplicationRights.chiffreAffaires) && !useCase && (
        <div style={{ marginBottom: '10px' }}>
          Vos droits vous donnent accès aux chiffres d‘affaires déclarés à la{' '}
          <DGFiP />.
          <AskUseCase
            idPrefix="finances-societe"
            setUseCase={setUseCase}
            label="Pour les ajouter à la section suivante, déclarez un cas d'usage :"
          />
        </div>
      )}
      {useCase ? (
        <ProtectedFinancesSocieteSection
          uniteLegale={uniteLegale}
          session={session}
          useCase={useCase}
        />
      ) : (
        <PublicFinancesSocieteSection
          uniteLegale={uniteLegale}
          session={session}
        />
      )}
    </>
  );
}
