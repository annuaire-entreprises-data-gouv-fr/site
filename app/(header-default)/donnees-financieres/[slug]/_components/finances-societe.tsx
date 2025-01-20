'use client';

import { AskUseCase } from '#components/section-with-use-case/ask-use-case';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { isDataSuccess } from '#models/data-fetching';
import { UseCase } from '#models/user/agent';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useFetchFinancesSociete } from 'hooks';
import { useManualAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { useEffect, useState } from 'react';
import { FinancesSocieteContent } from './finances-societe-content';

export function FinancesSocieteSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const financesSociete = useFetchFinancesSociete(uniteLegale);
  const [useCase, setUseCase] = useState<UseCase>();
  const [isProtected, setIsProtected] = useState(false);
  const [sources, setSources] = useState([EAdministration.MEF]);

  const {
    data: chiffreAffairesProtected,
    fetchData: fetchChiffreAffairesProtected,
  } = useManualAPIRouteData(
    APIRoutesPaths.EspaceAgentChiffreAffairesProtected,
    uniteLegale.siege.siret,
    session
  );

  useEffect(() => {
    if (useCase && hasRights(session, ApplicationRights.chiffreAffaires)) {
      fetchChiffreAffairesProtected({
        params: { useCase },
      });
      setSources((sources) => [...sources, EAdministration.DGFIP]);
      setIsProtected(true);
    }
  }, [useCase, fetchChiffreAffairesProtected, session]);

  return (
    <AsyncDataSectionClient
      title="Indicateurs financiers"
      id="finances-societe"
      sources={sources}
      data={financesSociete}
      isProtected={isProtected}
      notFoundInfo="Aucun indicateur financier n’a été retrouvé pour cette structure."
    >
      {(financesSociete) => {
        let newFinancesSociete = financesSociete;

        if (isDataSuccess(chiffreAffairesProtected)) {
          newFinancesSociete = {
            ...financesSociete,
            bilans: [
              ...financesSociete.bilans.map((bilan) => ({
                ...bilan,
                chiffreDAffairesDgfip: chiffreAffairesProtected.find(
                  (ca) => ca.year === bilan.year
                )?.chiffreAffaires,
              })),
              ...chiffreAffairesProtected
                .filter(
                  (caProtected) =>
                    !financesSociete.bilans.some(
                      (bilan) => bilan.year === caProtected.year
                    )
                )
                .map((caProtected) => ({
                  year: caProtected.year,
                  chiffreDAffaires: caProtected.chiffreAffaires,
                  confidentiality: financesSociete.bilans[0].confidentiality,
                  dateClotureExercice: '',
                })),
            ].sort((a, b) => a.year - b.year),
          };
        }

        return (
          <>
            {hasRights(session, ApplicationRights.chiffreAffaires) &&
              !useCase && (
                <div style={{ marginBottom: '10px' }}>
                  Vos droits vous permettent d‘enrichir cette section avec les
                  données de chiffres d‘affaires de la DGFiP.
                  <AskUseCase setUseCase={setUseCase} />
                </div>
              )}
            <FinancesSocieteContent
              uniteLegale={uniteLegale}
              session={session}
              financesSociete={newFinancesSociete}
            />
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}
