import AdministrationNotResponding from '#components/administration-not-responding';
import { LineChart } from '#components/chart/line';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
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
  agregatsComptableCollectivite,
}) => {
  const title = 'Agrégats comptables';
  if (isAPINotResponding(agregatsComptableCollectivite)) {
    const isNotFound = agregatsComptableCollectivite.errorType === 404;
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
        administration={agregatsComptableCollectivite.administration}
        errorType={agregatsComptableCollectivite.errorType}
        title={title}
      />
    );
  }

  const colorResultat = '#009FFD';
  const colorCA = '#FCA311';
  const agc = agregatsComptableCollectivite?.agregatsComptable || [];
  const lastModified = agregatsComptableCollectivite?.lastModified || '';

  const body = [
    [
      <>
        <ColorCircle color={colorCA} /> Chiffre d’affaires
      </>,
      ...agc.map((a) => formatCurrency(a.capitauxPropres)),
    ],
    [
      'Marge commerciale ou marge brute',
      ...agc.map((a) => formatCurrency(a.margeBrute)),
    ],
    [
      'Marge d’Excédent Brut d’Exploitation (EBE)',
      ...agc.map((a) => formatPercentage(a.margeEbe)),
    ],
    [
      <>
        <ColorCircle color={colorResultat} /> Résultat net
      </>,
      ...agc.map((a) => formatCurrency(a.resultatNet)),
    ],
  ];

  return (
    <Section
      title={title}
      sources={[EAdministration.MEF]}
      lastModified={lastModified}
    >
      <br />
      <LineChart
        height={250}
        data={{
          labels: agc.map((agregat) =>
            formatDateYear(agregat.dateClotureExercice)
          ),
          datasets: [
            {
              label: "Chiffre d'affaires",
              tension: 0.3,
              data: agc.map((agregat) => agregat.chiffreDAffaires ?? 0),
              borderColor: colorCA,
              backgroundColor: colorCA,
            },
            {
              label: 'Resultat net',
              tension: 0.3,
              data: agc.map((agregat) => agregat.resultatNet ?? 0),
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
          ...agc.map((a) => formatDateYear(a.dateClotureExercice)),
        ]}
        body={body}
      />
    </Section>
  );
};
