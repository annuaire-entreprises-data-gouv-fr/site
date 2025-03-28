'use client';

import {
  AsyncDataSectionClient,
  mergeDataSources,
} from '#components/section/data-section/client';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { IChiffreAffairesProtected } from '#models/espace-agent/chiffre-affaires';
import { UseCase } from '#models/use-cases';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useFetchFinancesSociete } from 'hooks';
import { IFinancesSociete } from 'hooks/fetch/finances-societe';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { useMemo } from 'react';
import {
  FinancesSocieteContent,
  IFinancesSocieteIndicateursFinanciers,
} from './finances-societe-content';

export function ProtectedFinancesSocieteSection({
  uniteLegale,
  session,
  useCase,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  useCase: UseCase;
}) {
  const financesSociete = useFetchFinancesSociete(uniteLegale);

  const params = useMemo(
    () => ({
      params: { useCase },
    }),
    [useCase]
  );
  const chiffreAffairesProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentChiffreAffairesProtected,
    uniteLegale.siege.siret,
    session,
    params
  );

  const mergedFinancesSociete = useMemo(() => {
    return mergeDataSources(
      financesSociete,
      chiffreAffairesProtected,
      mergeFinancesSocieteWithChiffreAffaires
    );
  }, [financesSociete, chiffreAffairesProtected]);

  return (
    <AsyncDataSectionClient
      title="Indicateurs financiers"
      id="finances-societe"
      sources={[EAdministration.MEF, EAdministration.DGFIP]}
      data={mergedFinancesSociete}
      isProtected={true}
      notFoundInfo="Aucun indicateur financier n'a été retrouvé pour cette structure."
    >
      {(mergedFinancesSociete) => {
        return (
          <FinancesSocieteContent
            uniteLegale={uniteLegale}
            session={session}
            financesSociete={mergedFinancesSociete}
          />
        );
      }}
    </AsyncDataSectionClient>
  );
}

const mergeFinancesSocieteWithChiffreAffaires = (
  financesSociete: IFinancesSociete | null,
  chiffreAffairesProtected: IChiffreAffairesProtected | null
): IFinancesSocieteIndicateursFinanciers => {
  return {
    ...financesSociete,
    bilans: (() => {
      const existingYears = new Set(
        (financesSociete?.bilans ?? []).map((bilan) => bilan.year)
      );

      const mergedBilans = (financesSociete?.bilans ?? []).map((bilan) => ({
        ...bilan,
        chiffreDAffairesDgfip: chiffreAffairesProtected?.find(
          (ca) => ca.year === bilan.year
        )?.chiffreAffaires,
      }));

      const additionalBilans = (chiffreAffairesProtected ?? [])
        .filter((caProtected) => !existingYears.has(caProtected.year))
        .map((caProtected) => ({
          year: caProtected.year,
          chiffreDAffairesDgfip: caProtected.chiffreAffaires,
          confidentiality:
            financesSociete?.bilans?.[0]?.confidentiality ?? 'Public',
          dateClotureExercice: `${caProtected.year}-12-31`,
        }));

      return [...mergedBilans, ...additionalBilans].sort(
        (a, b) => a.year - b.year
      );
    })(),
  };
};
