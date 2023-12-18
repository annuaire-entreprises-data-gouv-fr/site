import { LineChart } from '#components/chart/line';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  isAPINotResponding,
} from '#models/api-not-responding';
import constants from '#models/constants';
import { IDataAssociation } from '#models/index';
import { formatCurrency } from '#utils/helpers';

const ColorCircle = ({ color }: { color: string }) => (
  <span style={{ color }}>◆</span>
);

const colorResultat = constants.chartColors[1];
const colorCA = constants.chartColors[4];

/**
 * We use to have finances for association but data disappeared from open data API.
 *
 * @param param0
 * @returns
 */
export const FinancesAssociationSection: React.FC<{
  association: IDataAssociation;
}> = ({ association }) => {
  const data = association;
  const financesAssociation =
    (!!data &&
      !isAPINotResponding(data) &&
      data?.bilans.length > 0 &&
      data?.bilans) ||
    APINotRespondingFactory(EAdministration.MI, 404);

  return (
    <DataSection
      notFoundInfo="Aucun indicateur financier n’a été retrouvé pour cette association."
      title="Indicateurs financiers"
      sources={[EAdministration.MI]}
      data={financesAssociation}
    >
      {(bilans) => (
        <>
          <p>
            Voici les résultats financiers déclarés par le siège social de
            l’association&nbsp;:
          </p>
          <br />
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
              labels: bilans.map((bilan) => bilan.year),
              datasets: [
                {
                  label: 'Produit',
                  tension: 0.3,
                  data: bilans.map((bilan) => bilan.produits ?? 0),
                  borderColor: colorCA,
                  backgroundColor: colorCA,
                },
                {
                  label: 'Resultat',
                  tension: 0.3,
                  data: bilans.map((bilan) => bilan.resultat ?? 0),
                  borderColor: colorResultat,
                  backgroundColor: colorResultat,
                },
              ],
            }}
          />
          <br />
          <FullTable
            head={['Indicateurs', ...bilans.map((a) => a?.year.toString())]}
            body={[
              [
                <>
                  <ColorCircle color={colorCA} /> Total des produits
                </>,
                ...bilans.map((a) => formatCurrency(a?.produits ?? '')),
              ],
              [
                'Total des charges',
                ...bilans.map((a) => formatCurrency(a?.charges ?? '')),
              ],
              [
                'Montants des dons perçus',
                ...bilans.map((a) => formatCurrency(a?.dons ?? '')),
              ],
              [
                'Montants des subventions perçues',
                ...bilans.map((a) => formatCurrency(a?.subv ?? '')),
              ],
              [
                <>
                  <ColorCircle color={colorResultat} /> Résultat
                </>,
                ...bilans.map((a) => formatCurrency(a?.resultat ?? '')),
              ],
            ]}
          />
        </>
      )}
    </DataSection>
  );
};
