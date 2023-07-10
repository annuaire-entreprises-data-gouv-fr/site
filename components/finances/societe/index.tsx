import Info from '#components-ui/alerts/info';
import FAQLink from '#components-ui/faq-link';
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

export const FinancesSocieteSection: React.FC<IFinances> = ({
  uniteLegale,
  financesSociete,
}) => {
  if (isAPINotResponding(financesSociete)) {
    const isNotFound = financesSociete.errorType === 404;
    if (isNotFound) {
      return (
        <Section title="Indicateurs financiers" sources={[EAdministration.MEF]}>
          <p>
            Aucun indicateur financier n’a été retrouvé pour cette structure.
          </p>
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={financesSociete.administration}
        errorType={financesSociete.errorType}
        title="Données financières"
      />
    );
  }

  const bilans = financesSociete.bilans;
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
      sources={[EAdministration.MEF]}
      lastModified={financesSociete.lastModified}
    >
      <Info>
        Cette section est un travail en cours.
        <br />
        Si vous découvrez une erreur, merci de{' '}
        <a href={constants.links.parcours.contact}>nous en faire part</a> et
        nous la corrigerons au plus vite.
      </Info>
      {financesSociete.hasBilanConsolide && (
        <p>
          Cette entreprise déclare un <Tag color="info">bilan consolidé</Tag>.
          C’est le bilan d’un groupe de sociétés dont {uniteLegale.nomComplet}{' '}
          est la société mère. Son{' '}
          <FAQLink tooltipLabel="bilan consolidé" to="/faq/donnees-financieres">
            Qu’est-ce qu’un bilan consolidé ?
          </FAQLink>{' '}
          inclut ceux de ses filiales.
        </p>
      )}
      <p>
        Voici les résultats financiers
        {financesSociete.hasBilanConsolide ? ' consolidés' : ''} publiés par
        l’entreprise pour les {bilans.length} dernier{bilanPlural} exercice
        {bilanPlural}&nbsp;:
      </p>
      <LineChart
        htmlLegendId={'finance-data-legend'}
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
          //@ts-ignore
          <FAQLink tooltipLabel="Indicateurs" to="/faq/donnees-financieres">
            Définition des indicateurs
          </FAQLink>,
          ...bilans.map((a) => a?.year.toString()),
        ]}
        body={body}
      />
    </Section>
  );
};
