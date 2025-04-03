'use client';

import { SimpleSeparator } from '#components-ui/horizontal-separator';
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
import { FinancesSocieteInnerSection } from './inner-section';

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
      sources={[EAdministration.MEF, EAdministration.INPI]}
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
          <FinancesSocieteInnerSection
            financesSociete={financesSociete}
            session={session}
          />
          <br />
          <SimpleSeparator />
          {hasRights(session, ApplicationRights.chiffreAffaires) && (
            <>
              <p>
                En tant qu’agent public, vous pouvez enrichir la section des
                indicateurs des bilans complets ou simplifiés avec les chiffres
                d‘affaires déclarés à la <DGFiP />, si votre cas d’usage le
                permet.
              </p>
              <AskUseCase idPrefix="finances-societe" setUseCase={setUseCase} />
            </>
          )}
        </>
      )}
    </AsyncDataSectionClient>
  );
}
