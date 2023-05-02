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

export const AgregatsComptableCollectivite: React.FC<IDonneesFinancieres> = ({
  agregatsComptable,
}) => {
  const title = 'Agrégats comptables';
  if (isAPINotResponding(agregatsComptable)) {
    const isNotFound = agregatsComptable.errorType === 404;
    if (isNotFound) {
      return (
        <Section title={title} sources={[EAdministration.MEF]}>
          <p>
            Aucun agrégats comptables n’a été retrouvé pour cette collectivité
          </p>
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={agregatsComptable.administration}
        errorType={agregatsComptable.errorType}
        title={title}
      />
    );
  }

  // only five last bilans sorted from oldest to latest
  const sortedAgregatsComptable = agregatsComptable.bilans
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
      ...sortedAgregatsComptable.map((a) => formatCurrency(a.chiffreDAffaires)),
    ],
    [
      'Marge commerciale ou marge brute',
      ...sortedAgregatsComptable.map((a) => formatCurrency(a.margeBrute)),
    ],
    [
      'Marge d’Excédent Brut d’Exploitation (EBE)',
      ...sortedAgregatsComptable.map((a) => formatPercentage(a.margeEbe)),
    ],
    [
      <>
        <ColorCircle color={colorResultat} /> Résultat net
      </>,
      ...sortedAgregatsComptable.map((a) => formatCurrency(a.resultatNet)),
    ],
  ];

  return (
    <Section
      title={title}
      sources={[EAdministration.MEF]}
      lastModified={agregatsComptable.lastModified}
    >
      <p>
        Voici les {sortedAgregatsComptable.length} derniers bilans déclarés
        auprès de l’
        <INPI /> pour cette structure.
      </p>
      <p>
        À partir des bilans, les équipes du <MEF /> ont calculé et publié les
        indicateurs et ratios financiers suivants&nbsp;:
      </p>
      <br />
      <LineChart
        height={250}
        data={{
          labels: sortedAgregatsComptable.map((agregat) =>
            formatDateYear(agregat.dateClotureExercice)
          ),
          datasets: [
            {
              label: "Chiffre d'affaires",
              tension: 0.3,
              data: sortedAgregatsComptable.map(
                (agregat) => agregat.chiffreDAffaires ?? 0
              ),
              borderColor: colorCA,
              backgroundColor: colorCA,
            },
            {
              label: 'Resultat net',
              tension: 0.3,
              data: sortedAgregatsComptable.map(
                (agregat) => agregat.resultatNet ?? 0
              ),
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
          ...sortedAgregatsComptable.map((a) =>
            formatDateYear(a.dateClotureExercice)
          ),
        ]}
        body={body}
      />
    </Section>
  );
};
