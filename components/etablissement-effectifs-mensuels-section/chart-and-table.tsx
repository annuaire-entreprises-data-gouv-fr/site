"use client";

import { LineChart } from "#components/chart/line";
import { FullTable } from "#components/table/full";
import FAQLink from "#components-ui/faq-link";
import constants from "#models/constants";
import type { IEffectifsMensuelsProtected } from "#models/espace-agent/effectifs/mensuels";
import { formatDatePartial, formatFloatFr } from "#utils/helpers";

export const FAQEffectifMensuel = () => (
  <FAQLink tooltipLabel="Effectif mensuel">
    L'effectif moyen mensuel (EMM), correspond à l'effectif moyen des régimes
    général et agricole d'un établissement, issus de l'Urssaf et de la MSA
    depuis le répertoire commun des déclarants opéré par le GIP-MDS. Il inclut
    l'effectif moyen et les effectifs liés à l'obligation d'emploi travailleurs
    handicapés.
    <br />
    Ces données sont issues du Répertoire Commun des Déclarants (RCD) et
    réservées aux agents publics.
  </FAQLink>
);

const ColorCircle = ({ color }: { color: string }) => (
  <span style={{ color }}>◆</span>
);
const effectifMensuelRegimeGeneralColor = constants.chartColors[4];
const effectifMensuelRegimeAgricoleColor = constants.chartColors[1];

export function EffectifsMensuelsChartAndTable({
  effectifsRegimeAgricole,
  effectifsRegimeGeneral,
}: {
  effectifsRegimeAgricole: IEffectifsMensuelsProtected["effectifsRegimeAgricole"];
  effectifsRegimeGeneral: IEffectifsMensuelsProtected["effectifsRegimeGeneral"];
}) {
  const effectifsGeneralValues = effectifsRegimeGeneral
    .filter((effectif) => effectif.value != null)
    .sort((left, right) => left.date.localeCompare(right.date));
  const effectifsAgricoleValues = effectifsRegimeAgricole
    .filter((effectif) => effectif.value != null)
    .sort((left, right) => left.date.localeCompare(right.date));

  if (
    effectifsGeneralValues.length === 0 &&
    effectifsAgricoleValues.length === 0
  ) {
    return (
      <p>Aucun effectif mensuel n’a été retrouvé pour cet établissement.</p>
    );
  }

  const labels = Array.from(
    new Set(
      [...effectifsGeneralValues, ...effectifsAgricoleValues].map(
        (effectif) => effectif.date
      )
    )
  ).sort((left, right) => left.localeCompare(right));

  const generalDataByDate = new Map(
    effectifsGeneralValues.map((effectif) => [effectif.date, effectif.value])
  );
  const agricoleDataByDate = new Map(
    effectifsAgricoleValues.map((effectif) => [effectif.date, effectif.value])
  );

  return (
    <>
      <p>Voici l’évolution mensuelle de l’effectif de l’établissement.</p>
      <LineChart
        data={{
          labels: labels.map((date) => formatDatePartial(date) ?? date),
          datasets: [
            generalDataByDate.size > 0
              ? {
                  label: "Régime général",
                  tension: 0.3,
                  data: labels.map(
                    (date) => generalDataByDate.get(date) ?? null
                  ),
                  borderColor: effectifMensuelRegimeGeneralColor,
                  backgroundColor: effectifMensuelRegimeGeneralColor,
                }
              : null,
            agricoleDataByDate.size > 0
              ? {
                  label: "Régime agricole",
                  tension: 0.3,
                  data: labels.map(
                    (date) => agricoleDataByDate.get(date) ?? null
                  ),
                  borderColor: effectifMensuelRegimeAgricoleColor,
                  backgroundColor: effectifMensuelRegimeAgricoleColor,
                }
              : null,
          ].filter((item) => !!item),
        }}
        height={250}
        htmlLegendId="effectifs-mensuels-legend"
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
          generalDataByDate.size > 0
            ? [
                <>
                  <ColorCircle color={effectifMensuelRegimeGeneralColor} />{" "}
                  Régime général
                </>,
                ...labels.map((date) =>
                  formatFloatFr(generalDataByDate.get(date)?.toString() ?? "")
                ),
              ]
            : null,
          agricoleDataByDate.size > 0
            ? [
                <>
                  <ColorCircle color={effectifMensuelRegimeAgricoleColor} />{" "}
                  Régime agricole
                </>,
                ...labels.map((date) =>
                  formatFloatFr(agricoleDataByDate.get(date)?.toString() ?? "")
                ),
              ]
            : null,
        ].filter((item) => !!item)}
        head={[
          <FAQEffectifMensuel key="effectif-mensuel-definition" />,
          ...labels.map((date) => formatDatePartial(date) ?? date),
        ]}
      />
    </>
  );
}
