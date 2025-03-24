'use client';

import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { useFetchFinancesSociete } from 'hooks';
import { FinancesSocieteContent } from './finances-societe-content';

export function PublicFinancesSocieteSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const financesSociete = useFetchFinancesSociete(uniteLegale);

  return (
    <AsyncDataSectionClient
      title="Indicateurs financiers"
      id="finances-societe"
      sources={[EAdministration.MEF]}
      data={financesSociete}
      isProtected={false}
      notFoundInfo="Aucun indicateur financier n’a été retrouvé pour cette structure."
    >
      {(financesSociete) => (
        <FinancesSocieteContent
          uniteLegale={uniteLegale}
          session={session}
          financesSociete={financesSociete}
        />
      )}
    </AsyncDataSectionClient>
  );
}
