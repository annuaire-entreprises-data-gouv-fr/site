"use client";

import {
  AsyncDataSectionClient,
  mergeDataSources,
} from "#components/section/data-section/client";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import type { IChiffreAffairesProtected } from "#models/espace-agent/chiffre-affaires";
import {
  createDefaultIndicateursFinanciersWithDGFiP,
  type IIndicateursFinanciersSociete,
} from "#models/finances-societe/types";
import type { UseCase } from "#models/use-cases";
import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useFetchFinancesSociete } from "hooks";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import { useMemo } from "react";
import { FinancesSocieteInnerSection } from "./inner-section";

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
      id="indicateurs-financiers"
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
  // NOTES:
  // - we may have different bilan type between protected and open data
  // - we dont know the bilan type of protected data + we only have last three years
  const indicateurs = financesSociete?.indicateurs || [];

  indicateurs.forEach((i) => {
    // it seems that CADGFIP does not have bilans consolidés
    if (i.type === "K") {
      return;
    }
    const existingCADGFiP = chiffreAffairesProtected?.find(
      (c) => i.year === c.year
    );
    if (existingCADGFiP) {
      i.chiffreAffairesDGFiP = existingCADGFiP.chiffreAffaires;
    }
  });

  if (chiffreAffairesProtected) {
    chiffreAffairesProtected.forEach((c) => {
      const existingIndicateursOpenData = financesSociete?.indicateurs.find(
        (i) => i.year === c.year && i.type !== "K"
      );
      if (!existingIndicateursOpenData) {
        indicateurs.push(
          createDefaultIndicateursFinanciersWithDGFiP(
            c.year,
            "inconnu",
            c.dateFinExercice,
            c.chiffreAffaires
          )
        );
      }
    });
  }

  indicateurs.sort((a, b) => a.year - b.year);

  return {
    // default in case of no open data
    lastModified: financesSociete?.lastModified ?? "",
    hasBilanConsolide: financesSociete?.hasBilanConsolide ?? false,
    hasCADGFiP: true,
    indicateurs,
  };
};
