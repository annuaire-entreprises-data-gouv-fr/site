import { useMemo, useState } from "react";
import { DataSectionClient } from "#/components/section/data-section";
import { useServerFnData } from "#/hooks/fetch/use-server-fn-data";
import { EAdministration } from "#/models/administrations/e-administration";
import { ApplicationRights } from "#/models/authentication/user/rights";
import type { ICollectiviteDVF } from "#/models/collectivite/dvf";
import constants from "#/models/constants";
import { getCollectiviteDVFFn } from "#/server-functions/public/data-fetching/collectivites";
import { formatDatePartial, formatNumber } from "#/utils/helpers";
import {
  buildDVFMonthlyTimeline,
  dvfPriceSeries,
  formatDVFPrice,
  formatDVFPriceEvolution,
  getDVFPriceSummary,
} from "./chart-data";
import { DVFChart } from "./dvf-chart";
import styles from "./styles.module.css";

const periods = [
  { months: 12, label: "1 an" },
  { months: 36, label: "3 ans" },
  { months: 60, label: "5 ans" },
] as const;

export function DVFBoard({ dvf }: { dvf: ICollectiviteDVF }) {
  const [monthsCount, setMonthsCount] = useState<number>(60);
  const timeline = useMemo(
    () => buildDVFMonthlyTimeline(dvf.indicateurs, monthsCount),
    [dvf.indicateurs, monthsCount]
  );
  const latest = timeline.at(-1);

  if (!latest) {
    return (
      <p>
        Aucune donnée de transaction immobilière n’a été retrouvée pour cette
        commune.
      </p>
    );
  }

  return (
    <>
      <p>
        Prix médians au mètre carré et volumes de ventes à {dvf.nomCommune}, sur
        les cinq dernières années disponibles dans DVF.
      </p>
      <div className={styles.toolbar}>
        <p className={styles.period}>
          {formatDatePartial(timeline[0].mois)} —{" "}
          {formatDatePartial(latest.mois)}
        </p>
        <fieldset className={styles.periods}>
          <legend className="fr-sr-only">Période affichée</legend>
          {periods.map(({ months, label }) => (
            <button
              aria-pressed={monthsCount === months}
              className={
                monthsCount === months
                  ? styles.activePeriod
                  : styles.periodButton
              }
              key={months}
              onClick={() => setMonthsCount(months)}
              type="button"
            >
              {label}
            </button>
          ))}
        </fieldset>
      </div>
      <dl className={styles.prices}>
        {dvfPriceSeries.map(({ key, label, color }) => {
          const {
            evolution,
            first,
            last: observation,
          } = getDVFPriceSummary(timeline, key);
          const roundedEvolution =
            evolution === null ? null : Number(evolution.toFixed(1));
          const evolutionClassName =
            roundedEvolution === null || roundedEvolution === 0
              ? styles.evolutionNeutral
              : roundedEvolution > 0
                ? styles.evolutionIncrease
                : styles.evolutionDecrease;
          const evolutionTitle =
            evolution !== null && first && observation
              ? `Évolution du prix médian entre ${formatDatePartial(first.mois)} et ${formatDatePartial(observation.mois)}`
              : "Deux prix renseignés sont nécessaires pour calculer l’évolution sur cette période.";
          return (
            <div className={styles.price} key={key}>
              <dt>
                <span
                  aria-hidden="true"
                  className={styles.marker}
                  style={{ backgroundColor: color }}
                />
                {label}
              </dt>
              <dd>
                <div className={styles.priceValue}>
                  <strong>{formatDVFPrice(observation?.[key] ?? null)}</strong>
                  <span
                    className={`${styles.evolution} ${evolutionClassName}`}
                    title={evolutionTitle}
                  >
                    {formatDVFPriceEvolution(roundedEvolution)}
                  </span>
                </div>
                <span>
                  {observation
                    ? formatDatePartial(observation.mois)
                    : "Aucune valeur sur la période"}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
      <DVFChart timeline={timeline} />
      <div className={styles.volumesLegend}>
        <span>
          <span
            aria-hidden="true"
            className={styles.marker}
            style={{ backgroundColor: constants.colors.frBlue }}
          />{" "}
          Ventes de maisons
        </span>
        <span>
          <span
            aria-hidden="true"
            className={styles.marker}
            style={{ backgroundColor: constants.chartColors[4] }}
          />{" "}
          Ventes d’appartements
        </span>
      </div>
      <p className={styles.note}>
        {latest.nombreVentesLogements !== null && (
          <>
            {formatNumber(latest.nombreVentesLogements)} ventes de maisons et
            d’appartements en {formatDatePartial(latest.mois)}.{" "}
          </>
        )}
        Survolez un mois pour comparer les prix et les volumes de ventes.
      </p>
      <p className={styles.note}>
        Les pointillés relient des observations séparées par des données
        manquantes. Aucun prix n’est estimé pour ces mois.
      </p>
    </>
  );
}

export function CollectiviteDVFSection({ codeInsee }: { codeInsee: string }) {
  const input = useMemo(() => ({ codeInsee }), [codeInsee]);
  const dvf = useServerFnData(
    getCollectiviteDVFFn,
    input,
    ApplicationRights.opendata,
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  return (
    <DataSectionClient
      data={dvf}
      id="transactions-immobilieres"
      loadingMinHeight={600}
      notFoundInfo="Aucune donnée de transaction immobilière n’a été retrouvée pour cette commune."
      sources={[EAdministration.DGFIP]}
      title="Transactions immobilières — Demandes de valeurs foncières (DVF)"
    >
      {(data) => <DVFBoard dvf={data} />}
    </DataSectionClient>
  );
}
