import AdministrationNotResponding from '#components/administration-not-responding';
import { LineChart } from '#components/chart/line';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import { IDonneesFinancieres } from '#models/donnees-financieres';
import { formatDateYear, formatCurrency } from '#utils/helpers';

const ColorCircle = ({ color }: { color: string }) => (
  <span style={{ color }}>⏺</span>
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

  // only five last bilans sorted from oldest to latest
  const sortedBilans = bilansFinanciers.bilans
    .sort(
      (a, b) =>
        new Date(b.dateClotureExercice).getTime() -
        new Date(a.dateClotureExercice).getTime()
    )
    .slice(0, 5)
    .reverse();

  const colorResultat = '#009FFD';
  const colorCA = '#FCA311';

  const body = [
    [
      <>
        <ColorCircle color={colorCA} /> Chiffre d’affaires
      </>,
      ...sortedBilans.map((a) => formatCurrency(a.chiffreDAffaires.toString())),
    ],
    [
      <>
        <ColorCircle color={colorResultat} /> Résultat net
      </>,
      ...sortedBilans.map((a) => formatCurrency(a.resultatNet.toString())),
    ],
    [
      'Marge brute',
      ...sortedBilans.map((a) => formatCurrency(a.margeBrute.toString())),
    ],
    ['EBITDA', ...sortedBilans.map((a) => formatCurrency(a.ebitda.toString()))],
  ];

  return (
    <Section
      title="Bilans financiers"
      sources={[EAdministration.MEF]}
      lastModified={bilansFinanciers.lastModified}
    >
      <LineChart
        height={250}
        data={{
          labels: sortedBilans.map((bilan) =>
            formatDateYear(bilan.dateClotureExercice)
          ),
          datasets: [
            {
              label: "Chiffre d'affaires",
              tension: 0.3,
              data: sortedBilans.map((bilan) => bilan.chiffreDAffaires ?? 0),
              borderColor: colorCA,
              backgroundColor: colorCA,
            },
            {
              label: 'Resultat net',
              tension: 0.3,
              data: sortedBilans.map((bilan) => bilan.resultatNet ?? 0),
              borderColor: colorResultat,
              backgroundColor: colorResultat,
            },
          ],
        }}
      />
      <br />
      <FullTable
        head={[
          'Année fiscale',
          ...sortedBilans.map((a) => formatDateYear(a.dateClotureExercice)),
        ]}
        body={body}
      />
    </Section>
  );
};
