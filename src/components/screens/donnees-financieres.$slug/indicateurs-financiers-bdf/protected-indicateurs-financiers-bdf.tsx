import { useMemo } from "react";
import { AsyncDataSectionClient } from "#/components/section/data-section/client";
import { FullTable } from "#/components/table/full";
import FAQLink from "#/components-ui/faq-link";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import type { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import type { UseCase } from "#/models/use-cases";
import { getAgentBilansProtectedFn } from "#/server-functions/agent/data-fetching";
import { formatCurrency, formatDate, getDateFromYYYYMM } from "#/utils/helpers";

export function ProtectedIndicateursFinanciersBDF({
  uniteLegale,
  user,
  useCase,
  title,
  id,
  sources,
  isProtected,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
  useCase: UseCase;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
}) {
  const input = useMemo(
    () => ({ siren: uniteLegale.siren, useCase }),
    [uniteLegale.siren, useCase]
  );
  const banqueDeFranceBilansProtected = useServerFnData(
    getAgentBilansProtectedFn,
    user,
    input,
    ApplicationRights.bilansBDF
  );

  return (
    <AsyncDataSectionClient
      data={banqueDeFranceBilansProtected}
      id={id}
      isProtected={isProtected}
      notFoundInfo="Aucun indicateur n’a été retrouvé pour cette structure."
      sources={sources}
      title={title}
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
            body={body}
            head={[
              <FAQLink to="/faq/donnees-financieres" tooltipLabel="Indicateurs">
                Définition des indicateurs
              </FAQLink>,
              ...bilans.map((item) => item.annee),
            ]}
          />
        );
      }}
    </AsyncDataSectionClient>
  );
}
