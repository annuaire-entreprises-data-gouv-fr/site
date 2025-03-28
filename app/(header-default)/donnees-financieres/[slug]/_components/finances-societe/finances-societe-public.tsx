'use client';

import { DGFiP } from '#components/administrations';
import { AskUseCase } from '#components/section-with-use-case/ask-use-case';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { UseCase } from '#models/use-cases';
import { useFetchFinancesSociete } from 'hooks';
import { FinancesSocieteContent } from './finances-societe-content';

const NotFoundInfo = ({
  setUseCase,
}: {
  setUseCase: (useCase: UseCase) => void;
}) => (
  <>
    Aucun indicateur financier n’a été retrouvé pour cette structure.
    <div style={{ marginTop: '30px' }}>
      Vos droits vous permettent d‘enrichir cette section avec les chiffres
      d‘affaires déclarés à la <DGFiP />.
      <AskUseCase idPrefix="finances-societe" setUseCase={setUseCase} />
    </div>
  </>
);

export function PublicFinancesSocieteSection({
  uniteLegale,
  session,
  setUseCase,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  setUseCase: (useCase: UseCase) => void;
}) {
  const financesSociete = useFetchFinancesSociete(uniteLegale);

  return (
    <AsyncDataSectionClient
      title="Indicateurs financiers"
      id="finances-societe"
      sources={[EAdministration.MEF]}
      data={financesSociete}
      isProtected={false}
      notFoundInfo={
        hasRights(session, ApplicationRights.chiffreAffaires) ? (
          <NotFoundInfo setUseCase={setUseCase} />
        ) : (
          'Aucun indicateur financier n’a été retrouvé pour cette structure.'
        )
      }
    >
      {(financesSociete) => (
        <>
          <FinancesSocieteContent
            uniteLegale={uniteLegale}
            session={session}
            financesSociete={financesSociete}
          />
          {hasRights(session, ApplicationRights.chiffreAffaires) && (
            <div style={{ marginTop: '30px' }}>
              Vos droits vous permettent d‘enrichir cette section avec les
              chiffres d‘affaires déclarés à la <DGFiP />.
              <AskUseCase idPrefix="finances-societe" setUseCase={setUseCase} />
            </div>
          )}
        </>
      )}
    </AsyncDataSectionClient>
  );
}
