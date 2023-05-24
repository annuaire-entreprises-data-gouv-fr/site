import Info from '#components-ui/alerts/info';
import AdministrationNotResponding from '#components/administration-not-responding';
import { INPI, MEF } from '#components/administrations';
import { LineChart } from '#components/chart/line';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import constants from '#models/constants';
import { IDonneesFinancieres } from '#models/donnees-financieres';
import {
  formatDateYear,
  formatCurrency,
  formatPercentage,
} from '#utils/helpers';

const ColorCircle = ({ color }: { color: string }) => (
  <span style={{ color }}>◆</span>
);

export const BilansFinanciersSection: React.FC<IDonneesFinancieres> = ({
  bilansFinanciers,
}) => {
  if (isAPINotResponding(bilansFinanciers)) {
    const isNotFound = bilansFinanciers.errorType === 404;
    if (isNotFound) {
      return (
        <Section title="Bilans financiers" sources={[EAdministration.MEF]}>
          <p>Aucun bilan financier n’a été retrouvé pour cette structure.</p>
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={bilansFinanciers.administration}
        errorType={bilansFinanciers.errorType}
        title="Données financières"
      />
    );
  }

  const bilans = bilansFinanciers.bilans;
  const colorResultat = constants.chartColors[1];
  const colorCA = constants.chartColors[4];

  const body = [
    [
      <>
        <ColorCircle color={colorCA} /> Chiffre d’affaires
      </>,
      ...bilans.map((a) => formatCurrency(a.chiffreDAffaires)),
    ],
    [
      'Marge commerciale ou marge brute',
      ...bilans.map((a) => formatCurrency(a.margeBrute)),
    ],
    [
      'Marge d’Excédent Brut d’Exploitation (EBE)',
      ...bilans.map((a) => formatPercentage(a.margeEbe)),
    ],
    [
      <>
        <ColorCircle color={colorResultat} /> Résultat net
      </>,
      ...bilans.map((a) => formatCurrency(a.resultatNet)),
    ],
    [
      'Type de bilan',
      ...bilans.map(({ type }) =>
        type === 'K' ? 'Consolidé' : type === 'C' ? 'Complet' : 'Simplifié'
      ),
    ],
  ];

  return (
    <Section
      title="Bilans financiers"
      sources={[EAdministration.MEF]}
      lastModified={bilansFinanciers.lastModified}
    >
      <Info>
        Cette section est un travail en cours. Les bilans financiers sont des
        données difficiles à maitriser et notre travail peut contenir des
        erreurs.
        <br />
        Si vous découvrez une erreur, merci de nous en faire part en nous
        écrivant à <a href={constants.links.mailto}>{constants.links.mail}</a>
      </Info>
      <p>
        Voici les {bilans.length} derniers bilans déclarés auprès de l’
        <INPI /> pour cette structure.
      </p>
      <p>
        À partir des bilans, les équipes du <MEF /> ont calculé et publié les
        indicateurs et ratios financiers suivants&nbsp;:
      </p>
      <br />
      <LineChart
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label(tooltipItem) {
                  return formatCurrency(
                    tooltipItem.parsed.y.toString()
                  ).toString();
                },
              },
            },
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
              data: bilans.map((bilan) => bilan.chiffreDAffaires ?? 0),
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
          'Indicateurs',
          ...bilans.map((a) => formatDateYear(a.dateClotureExercice)),
        ]}
        body={body}
      />
    </Section>
  );
};
