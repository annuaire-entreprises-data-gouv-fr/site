"use client";

import FAQLink from "#components-ui/faq-link";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import { EAdministration } from "#models/administrations/EAdministration";
import { ISession } from "#models/authentication/user/session";
import { IUniteLegale } from "#models/core/types";
import { UseCase } from "#models/use-cases";
import { formatCurrency, formatDate, getDateFromYYYYMM } from "#utils/helpers";
import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import { useMemo } from "react";

export function ProtectedIndicateursFinanciersBDF({
  uniteLegale,
  session,
  useCase,
  title,
  id,
  sources,
  isProtected,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  useCase: UseCase;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
}) {
  const params = useMemo(
    () => ({
      params: { useCase },
    }),
    [useCase]
  );
  const banqueDeFranceBilansProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentBilansProtected,
    uniteLegale.siren,
    session,
    params
  );

  return (
    <AsyncDataSectionClient
      title={title}
      id={id}
      isProtected={isProtected}
      sources={sources}
      data={banqueDeFranceBilansProtected}
      notFoundInfo="Aucun indicateur n’a été retrouvé pour cette structure."
    >
      {(bilans) => {
        const body = [
          [
            "Date de clôture",
            ...bilans.map((item) =>
              formatDate(getDateFromYYYYMM(item.dateArreteExercice || ""))
            ),
          ],
          [
            "Besoin en Fonds de Roulement",
            ...bilans.map((item) =>
              formatCurrency(item.besoinEnFondsDeRoulement)
            ),
          ],
          [
            "Capacité d’Autofinancement",
            ...bilans.map((item) =>
              formatCurrency(item.capaciteAutofinancement)
            ),
          ],
          [
            "Dettes 4 maturité à un an au plus",
            ...bilans.map((item) =>
              formatCurrency(item.dettes4MaturiteAUnAnAuPlus)
            ),
          ],
          [
            "Disponibilités",
            ...bilans.map((item) => formatCurrency(item.disponibilites)),
          ],

          [
            "Excédent Brut d’Exploitation",
            ...bilans.map((item) =>
              formatCurrency(item.excedentBrutExploitation)
            ),
          ],
          [
            "Fonds de Roulement Net Global",
            ...bilans.map((item) =>
              formatCurrency(item.fondsRoulementNetGlobal)
            ),
          ],
          [
            "Ratio Fonds de Roulement Net Global sur Besoin en Fonds de Roulement",
            ...bilans.map((item) =>
              formatCurrency(
                item.ratioFondsRoulementNetGlobalSurBesoinEnFondsDeRoulement
              )
            ),
          ],
          [
            "Total Dettes Stables",
            ...bilans.map((item) => formatCurrency(item.totalDettesStables)),
          ],
          [
            "Valeur ajoutée BDF",
            ...bilans.map((item) => formatCurrency(item.valeurAjouteeBdf)),
          ],
        ];

        return (
          <FullTable
            head={[
              <FAQLink tooltipLabel="Indicateurs" to="/faq/donnees-financieres">
                Définition des indicateurs
              </FAQLink>,
              ...bilans.map((item) => item.annee),
            ]}
            body={body}
          />
        );
      }}
    </AsyncDataSectionClient>
  );
}
