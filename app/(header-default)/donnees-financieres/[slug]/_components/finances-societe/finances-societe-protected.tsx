'use client';

import {
  AsyncDataSectionClient,
  mergeDataSources,
} from '#components/section/data-section/client';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { IChiffreAffairesProtected } from '#models/espace-agent/chiffre-affaires';
import {
  createDefaultIndicateursFinanciersWithDGFiP,
  IIndicateursFinanciersSociete,
} from '#models/finances-societe/types';
import { UseCase } from '#models/use-cases';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useFetchFinancesSociete } from 'hooks';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { useMemo } from 'react';
import { FinancesSocieteInnerSection } from './inner-section';

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
      sources={[
        EAdministration.MEF,
        EAdministration.DGFIP,
        EAdministration.INPI,
      ]}
      data={mergedFinancesSociete}
      isProtected={true}
      notFoundInfo="Aucun indicateur financier n'a été retrouvé pour cette structure."
    >
      {(mergedFinancesSociete) => {
        return (
          <FinancesSocieteInnerSection
            financesSociete={mergedFinancesSociete}
            session={session}
          />
        );
      }}
    </AsyncDataSectionClient>
  );
}

const mergeFinancesSocieteWithChiffreAffaires = (
  financesSociete: IIndicateursFinanciersSociete | null,
  chiffreAffairesProtected: IChiffreAffairesProtected | null
): IIndicateursFinanciersSociete => {
  // as we may have different bilan type we can have multiple years
  // and we dont know CAProtected type + we only have last three years
  const existingYear = new Set([
    ...(financesSociete?.indicateurs ?? []).map((i) => [i.year, i.type]),
    ...(chiffreAffairesProtected ?? []).map((c) => [c.year, 'inconnu']),
  ]);

  const indicateurs = financesSociete?.indicateurs || [];

  indicateurs.forEach((i) => {
    // it seems that CADGFIP does not have bilan consolidés
    if (i.type === 'K') {
      return;
    }
    const existingCADGFiP = chiffreAffairesProtected?.find(
      (c) => i.year === c.year
    );
    if (existingCADGFiP) {
      i.chiffreAffairesDGFiP = existingCADGFiP.chiffreAffaires;
    }
  });

  chiffreAffairesProtected?.forEach((c) => {
    const existingIndicateursOpenData = financesSociete?.indicateurs.find(
      (i) => i.year === c.year && i.type !== 'K'
    );
    if (!existingIndicateursOpenData) {
      indicateurs.push(
        createDefaultIndicateursFinanciersWithDGFiP(
          c.year,
          'inconnu',
          c.dateFinExercice,
          c.chiffreAffaires
        )
      );
    }
  });

  indicateurs.sort((a, b) => a.year - b.year);

  return {
    // default in case of no open data
    lastModified: financesSociete?.lastModified ?? '',
    hasBilanConsolide: financesSociete?.hasBilanConsolide ?? false,
    hasCADGFiP: true,
    indicateurs,
  };
};
