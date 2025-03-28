'use client';

import { Info } from '#components-ui/alerts';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { LineChart } from '#components/chart/line';
import { FullTable } from '#components/table/full';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import constants from '#models/constants';
import { IUniteLegale } from '#models/core/types';

import {
  formatCurrency,
  formatDate,
  formatDateYear,
  pluralize,
} from '#utils/helpers';

const ColorCircle = ({ color }: { color: string }) => (
  <span style={{ color }}>◆</span>
);
const colorResultat = constants.chartColors[1];
const colorCA = constants.chartColors[4];

export interface IFinancesSocieteIndicateursFinanciers {
  bilans: {
    year: number;
    confidentiality: 'Public' | string;
    dateClotureExercice: string;
    chiffreDAffaires?: number;
    chiffreDAffairesDgfip?: number;
    margeBrute?: number;
    excedentBrutDExploitation?: number;
    resultatNet?: number;
  }[];
  hasBilanConsolide?: boolean;
  lastModified?: any;
}

export function FinancesSocieteContent({
  financesSociete,
  uniteLegale,
  session,
}: {
  financesSociete: IFinancesSocieteIndicateursFinanciers;
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const bilans = financesSociete.bilans;

  if (
    bilans.find((e) => e.confidentiality !== 'Public') &&
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
      ...bilans.map((a) => formatDate(a?.dateClotureExercice ?? '')),
    ],
    [
      <>
        <ColorCircle color={colorCA} /> Chiffre d’affaires
      </>,
      ...bilans.map((a) =>
        formatCA(a.chiffreDAffaires, a.chiffreDAffairesDgfip)
      ),
    ],
    ['Marge brute', ...bilans.map((a) => formatCurrency(a?.margeBrute ?? ''))],
    [
      'Excédent Brut d’Exploitation',
      ...bilans.map((a) => formatCurrency(a?.excedentBrutDExploitation ?? '')),
    ],
    [
      <>
        <ColorCircle color={colorResultat} /> Résultat net
      </>,
      ...bilans.map((a) => formatCurrency(a?.resultatNet ?? '')),
    ],
  ];
  const plural = pluralize(bilans);

  return (
    <>
      {financesSociete.hasBilanConsolide && (
        <div>
          Cette entreprise déclare un <Tag color="info">bilan consolidé</Tag>.
          C’est le bilan d’un groupe de sociétés dont {uniteLegale.nomComplet}{' '}
          est la société mère. Son{' '}
          <FAQLink
            tooltipLabel="bilan consolidé"
            to="/faq/donnees-financieres#quest-ce-quun-bilan-consolide"
          >
            Qu’est-ce qu’un bilan consolidé ?
          </FAQLink>{' '}
          inclut ceux de ses filiales.
        </div>
      )}
      <p>
        Voici les résultats financiers
        {financesSociete.hasBilanConsolide ? ' consolidés' : ''} publiés par
        l’entreprise pour {plural ? `les ${bilans.length}` : 'le'} dernier
        {plural} exercice
        {plural}&nbsp;:
      </p>
      <LineChart
        htmlLegendId={'finance-data-legend'}
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
          labels: bilans.map((bilan) =>
            formatDateYear(bilan.dateClotureExercice)
          ),
          datasets: [
            {
              label: "Chiffre d'affaires",
              tension: 0.3,
              data: bilans.map(
                (bilan) =>
                  bilan.chiffreDAffaires ?? bilan.chiffreDAffairesDgfip ?? 0
              ),
              borderColor: colorCA,
              backgroundColor: colorCA,
            },
            {
              label: 'Resultat net',
              tension: 0.3,
              data: bilans.map((bilan) => bilan.resultatNet ?? 0),
              borderColor: colorResultat,
              backgroundColor: colorResultat,
            },
          ],
        }}
      />
      <br />
      <FullTable
        head={[
          <FAQLink tooltipLabel="Indicateurs" to="/faq/donnees-financieres">
            Définition des indicateurs
          </FAQLink>,
          ...bilans.map((a) => a?.year.toString()),
        ]}
        body={body}
      />
    </>
  );
}

function formatCA(ca: number | undefined, caDgfip: number | undefined) {
  if (!ca && !caDgfip) {
    return 'N/A';
  } else if (ca === caDgfip || !caDgfip) {
    return <div>{formatCurrency(ca ?? '')} </div>;
  } else if (!ca) {
    return (
      <>
        {formatCurrency(caDgfip ?? '')}{' '}
        <FAQLink tooltipLabel="(DGFiP)">
          Cette donnée provient de la DGFiP, il n‘y avait pas de données
          publiques.
        </FAQLink>
      </>
    );
  } else {
    return (
      <>
        <div>{formatCurrency(ca ?? '')} </div>
        <div>
          {formatCurrency(caDgfip ?? '')}{' '}
          <FAQLink tooltipLabel="(DGFiP)">
            Cette donnée provient de la DGFiP, elle est différente de la donnée
            publique.
          </FAQLink>
        </div>
      </>
    );
  }
}
