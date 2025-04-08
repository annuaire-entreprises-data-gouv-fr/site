'use client';

import { Info } from '#components-ui/alerts';
import FAQLink from '#components-ui/faq-link';
import { LineChart } from '#components/chart/line';
import { FullTable } from '#components/table/full';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import constants from '#models/constants';
import { IIndicateursFinanciers } from '#models/finances-societe/types';

import {
  formatCurrency,
  formatDate,
  formatDateYear,
  pluralize,
} from '#utils/helpers';
import { BilanTypeTag } from '../bilan-tag';

const ColorCircle = ({ color }: { color: string }) => (
  <span style={{ color }}>◆</span>
);
const colorResultat = constants.chartColors[1];
const colorCA = constants.chartColors[4];
const colorCADGFiP = constants.chartColors[3];

export function FinancesSocieteChartAndTable({
  indicateurs,
  estBilanConsolide = false,
  hasCADGFiP,
  session,
}: {
  indicateurs: IIndicateursFinanciers[];
  estBilanConsolide?: boolean;
  hasCADGFiP: boolean;
  session: ISession | null;
}) {
  if (
    indicateurs.find(
      (bilanIndicateurs) => bilanIndicateurs.confidentiality !== 'Public'
    ) &&
    !hasRights(session, ApplicationRights.bilansRne)
  ) {
    return (
      <Info>
        Les bilans de cette structure sont accompagnés d’une déclaration de
        confidentialité.
        <br />
        Seuls les <strong>agents publics</strong> peuvent les consulter sur ce
        site.
      </Info>
    );
  }
  const body = [
    [
      'Date de clôture',
      ...indicateurs.map((bilanIndicateurs) =>
        formatDate(bilanIndicateurs?.dateClotureExercice ?? '')
      ),
    ],
    [
      'Type de bilan',
      ...indicateurs.map((bilanIndicateurs) => (
        <BilanTypeTag type={bilanIndicateurs.type} />
      )),
    ],
    [
      <>
        <ColorCircle color={colorCA} /> Chiffre d’affaires
      </>,
      ...indicateurs.map((bilanIndicateurs) =>
        formatCurrency(bilanIndicateurs.chiffreDAffaires ?? '')
      ),
    ],
    ...(hasCADGFiP
      ? [
          [
            <>
              <ColorCircle color={colorCADGFiP} /> Chiffre d’affaires{' '}
              <FAQLink tooltipLabel="DGFiP">
                La DGFiP fournit le chiffre d’affaires pour les trois dernières
                années.
                <br />
                Cela vous permet d’accéder au dernier chiffre d’affaires avant
                sa publication en open data, ou d’y accéder dans le cas ou
                l’entreprise a publié ses comptes avec une déclaration de
                confidentialité.
              </FAQLink>
            </>,
            ...indicateurs.map((bilanIndicateurs) =>
              formatCurrency(bilanIndicateurs.chiffreAffairesDGFiP ?? '')
            ),
          ],
        ]
      : []),
    [
      'Marge brute',
      ...indicateurs.map((bilanIndicateurs) =>
        formatCurrency(bilanIndicateurs?.margeBrute ?? '')
      ),
    ],
    [
      'Excédent Brut d’Exploitation',
      ...indicateurs.map((bilanIndicateurs) =>
        formatCurrency(bilanIndicateurs?.ebe ?? '')
      ),
    ],
    [
      <>
        <ColorCircle color={colorResultat} /> Résultat net
      </>,
      ...indicateurs.map((bilanIndicateurs) =>
        formatCurrency(bilanIndicateurs?.resultatNet ?? '')
      ),
    ],
  ];
  const plural = pluralize(indicateurs);

  const datasets = [
    {
      label: "Chiffre d'affaires",
      tension: 0.3,
      data: indicateurs.map(
        (bilanIndicateurs) => bilanIndicateurs.chiffreDAffaires ?? null
      ),
      borderColor: colorCA,
      backgroundColor: colorCA,
    },

    {
      label: 'Résultat net',
      tension: 0.3,
      data: indicateurs.map(
        (bilanIndicateurs) => bilanIndicateurs.resultatNet ?? null
      ),
      borderColor: colorResultat,
      backgroundColor: colorResultat,
    },
  ];

  if (hasCADGFiP) {
    datasets.push({
      label: "Chiffre d'affaires DGFiP",
      tension: 0.3,
      data: indicateurs.map(
        (bilanIndicateurs) => bilanIndicateurs.chiffreAffairesDGFiP ?? 0
      ),
      borderColor: colorCADGFiP,
      backgroundColor: colorCADGFiP,
    });
  }

  return (
    <>
      <p>
        Voici les résultats financiers
        {estBilanConsolide ? (
          <>
            {' '}
            <FAQLink
              tooltipLabel="consolidés"
              to="/faq/donnees-financieres#quest-ce-quun-bilan-consolide"
            >
              Qu’est-ce qu’un bilan consolidé ?
            </FAQLink>{' '}
            (qui incluent ceux des filiales)
          </>
        ) : (
          ''
        )}{' '}
        publiés par l’entreprise pour{' '}
        {plural ? `les ${indicateurs.length}` : 'le'} dernier
        {plural} exercice
        {plural}&nbsp;:
      </p>
      <LineChart
        htmlLegendId={
          estBilanConsolide
            ? 'data-legend-consolide'
            : 'data-legend-non-consolide'
        }
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label(tooltipItem) {
                  return formatCurrency(tooltipItem.parsed.y.toString());
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
                callback: (label) => {
                  return formatCurrency(label.toString());
                },
              },
            },
          },
        }}
        height={250}
        data={{
          labels: indicateurs.map((bilanIndicateurs) =>
            formatDateYear(bilanIndicateurs.dateClotureExercice)
          ),
          datasets,
        }}
      />
      <br />
      <FullTable
        head={[
          <FAQLink tooltipLabel="Indicateurs" to="/faq/donnees-financieres">
            Définition des indicateurs
          </FAQLink>,
          ...indicateurs.map((bilanIndicateurs) =>
            bilanIndicateurs?.year.toString()
          ),
        ]}
        body={body}
      />
    </>
  );
}
