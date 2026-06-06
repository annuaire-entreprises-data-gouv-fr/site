import { LineChart } from "#/components/chart/line";
import { FullTable } from "#/components/table/full";
import {
  type IAPINotRespondingError,
  isAPINotResponding,
} from "#/models/api-not-responding";
import constants from "#/models/constants";
import type { IEffectifsAnnuelsProtected } from "#/models/espace-agent/effectifs/annuels";
import { formatFloatFr } from "#/utils/helpers";

const ColorCircle = ({ color }: { color: string }) => (
  <span style={{ color }}>◆</span>
);
const effectifAnnuelRegimeGeneralColor = constants.chartColors[4];
const effectifAnnuelRegimeAgricoleColor = constants.chartColors[1];

interface IEffectifAnnuelValue {
  annee: string;
  value: number;
}

export function EffectifsAnnuelsChartAndTable({
  effectifsAnnuels,
}: {
  effectifsAnnuels: IEffectifsAnnuelsProtected[];
}) {
  const effectifsGeneralValues = effectifsAnnuels
    .map((effectifs) => ({
      annee: effectifs.anneeEffectif,
      value: effectifs.effectifsRegimeGeneral.find(
        (effectif) => effectif.value != null
      )?.value,
    }))
    .filter(
      (effectif): effectif is IEffectifAnnuelValue => effectif.value != null
    )
    .sort((left, right) => left.annee.localeCompare(right.annee));

  const effectifsAgricoleValues = effectifsAnnuels
    .map((effectifs) => ({
      annee: effectifs.anneeEffectif,
      value: effectifs.effectifsRegimeAgricole.find(
        (effectif) => effectif.value != null
      )?.value,
    }))
    .filter(
      (effectif): effectif is IEffectifAnnuelValue => effectif.value != null
    )
    .sort((left, right) => left.annee.localeCompare(right.annee));

  if (
    effectifsGeneralValues.length === 0 &&
    effectifsAgricoleValues.length === 0
  ) {
    return <p>Aucun effectif annuel n’a été retrouvé pour cette entreprise.</p>;
  }

  const labels = Array.from(
    new Set(
      [...effectifsGeneralValues, ...effectifsAgricoleValues].map(
        (effectif) => effectif.annee
      )
    )
  ).sort((left, right) => left.localeCompare(right));

  const generalDataByYear = new Map(
    effectifsGeneralValues.map((effectif) => [effectif.annee, effectif.value])
  );
  const agricoleDataByYear = new Map(
    effectifsAgricoleValues.map((effectif) => [effectif.annee, effectif.value])
  );

  return (
    <>
      <LineChart
        data={{
          labels,
          datasets: [
            generalDataByYear.size > 0
              ? {
                  label: "Régime général",
                  tension: 0.3,
                  data: labels.map(
                    (year) => generalDataByYear.get(year) ?? null
                  ),
                  borderColor: effectifAnnuelRegimeGeneralColor,
                  backgroundColor: effectifAnnuelRegimeGeneralColor,
                }
              : null,
            agricoleDataByYear.size > 0
              ? {
                  label: "Régime agricole",
                  tension: 0.3,
                  data: labels.map(
                    (year) => agricoleDataByYear.get(year) ?? null
                  ),
                  borderColor: effectifAnnuelRegimeAgricoleColor,
                  backgroundColor: effectifAnnuelRegimeAgricoleColor,
                }
              : null,
          ].filter((item) => !!item),
        }}
        height={250}
        htmlLegendId="effectifs-annuels-legend"
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label(tooltipItem) {
                  if (tooltipItem.parsed.y == null) {
                    return tooltipItem.dataset.label ?? "";
                  }

                  return `${tooltipItem.dataset.label} : ${formatFloatFr(
                    tooltipItem.parsed.y.toString()
                  )}`;
                },
              },
            },
            legend: { display: false },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              border: { display: false },
              ticks: {
                callback: (label) => formatFloatFr(label.toString()),
              },
            },
          },
        }}
      />
      <br />
      <FullTable
        body={[
          generalDataByYear.size > 0
            ? [
                <>
                  <ColorCircle color={effectifAnnuelRegimeGeneralColor} />{" "}
                  Régime général
                </>,
                ...labels.map((year) =>
                  formatFloatFr(generalDataByYear.get(year)?.toString() ?? "")
                ),
              ]
            : null,
          agricoleDataByYear.size > 0
            ? [
                <>
                  <ColorCircle color={effectifAnnuelRegimeAgricoleColor} />{" "}
                  Régime agricole
                </>,
                ...labels.map((year) =>
                  formatFloatFr(agricoleDataByYear.get(year)?.toString() ?? "")
                ),
              ]
            : null,
        ].filter((item) => !!item)}
        head={["", ...labels]}
      />
    </>
  );
}

export function filterEffectifsAnnuelsWithData(
  effectifsAnnuels: Array<IEffectifsAnnuelsProtected | IAPINotRespondingError>
) {
  return effectifsAnnuels.filter(
    (effectifs): effectifs is IEffectifsAnnuelsProtected =>
      !isAPINotResponding(effectifs)
  );
}
