import Info from '#components-ui/alerts/info';
import { Tag } from '#components-ui/tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { LineChart } from '#components/chart/line';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import constants from '#models/constants';
import { IFinances } from '#models/donnees-financieres';
import { formatDateYear, formatCurrency, formatDate } from '#utils/helpers';

const ColorCircle = ({ color }: { color: string }) => (
  <span style={{ color }}>◆</span>
);

export const FinancesAssociationSection: React.FC<IFinances> = ({
  uniteLegale,
  financesAssociation,
}) => {
  if (isAPINotResponding(financesAssociation)) {
    const isNotFound = financesAssociation.errorType === 404;
    if (isNotFound) {
      return (
        <Section title="Indicateurs financiers" sources={[EAdministration.MI]}>
          <p>
            Aucun indicateur financier n’a été retrouvé pour cette association.
          </p>
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={financesAssociation.administration}
        errorType={financesAssociation.errorType}
        title="Données financières"
      />
    );
  }

  const bilans = financesAssociation.bilans;
  const colorResultat = constants.chartColors[1];
  const colorCA = constants.chartColors[4];

  const body = [
    [
      'Date de clôture',
      ...bilans.map((a) => formatDate(a?.dateClotureExercice ?? '')),
    ],
    [
      <>
        <ColorCircle color={colorCA} /> Chiffre d’affaires
      </>,
      ...bilans.map((a) => formatCurrency(a?.chiffreDAffaires ?? '')),
    ],
    ['Marge brute', ...bilans.map((a) => formatCurrency(a?.margeBrute ?? ''))],
    [
      'Excédent Brut d’Exploitation',
      ...bilans.map((a) => formatCurrency(a?.ebe ?? '')),
    ],
    [
      <>
        <ColorCircle color={colorResultat} /> Résultat net
      </>,
      ...bilans.map((a) => formatCurrency(a?.resultatNet ?? '')),
    ],
  ];

  const bilanPlural = bilans.length > 1 ? 's' : '';

  return (
    <Section
      title="Indicateurs financiers"
      sources={[EAdministration.MI]}
      lastModified={financesAssociation.lastModified}
    >
      <Info>
        Cette section est un travail en cours.
        <br />
        Si vous découvrez une erreur, merci de nous en faire part et nous la
        corrigerons au plus vite (
        <a href={constants.links.mailto}>{constants.links.mail}</a>).
      </Info>
      {financesAssociation.hasBilanConsolide && (
        <p>
          Cette entreprise déclare un <Tag color="info">bilan consolidé</Tag>.
          C’est le bilan d’un groupe de sociétés dont {uniteLegale.nomComplet}{' '}
          est la société mère. Son bilan consolidé inclut ceux de ses filiales.
        </p>
      )}
      <p>
        Voici les résultats financiers
        {financesAssociation.hasBilanConsolide ? ' consolidés' : ''} publiés par
        l’entreprise pour les {bilans.length} dernier{bilanPlural} exercice
        {bilanPlural}&nbsp;:
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
        head={['Indicateurs', ...bilans.map((a) => a?.year.toString())]}
        body={body}
      />
    </Section>
  );
};
