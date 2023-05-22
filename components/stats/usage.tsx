import { ChartData } from 'chart.js';
import { DoughnutChart } from '#components/chart/doughnut';
import { LineChart } from '#components/chart/line';
import constants from '#models/constants';

export const UsageStats: React.FC<{
  copyPasteAction: {
    value: number;
    label: string;
  }[];
  redirectedSiren: {
    value: number;
    label: string;
  }[];
  mostCopied: { label: string; count: number }[];
}> = ({ redirectedSiren, copyPasteAction, mostCopied }) => {
  const data: ChartData<'line', (number | null)[], string> = {
    labels: redirectedSiren.map((redirected) => redirected.label),
    datasets: [
      {
        label: 'Utilisation du siren/siret dans la recherche',
        tension: 0.3,
        data: redirectedSiren.map((redirected) => redirected.value || null),
        borderColor: constants.chartColors[6],
        backgroundColor: constants.chartColors[6],
      },
      {
        label: 'Utilisation du copier-coller',
        data: copyPasteAction.map((action) => action.value || null),
        tension: 0.3,
        borderColor: constants.chartColors[1],
        backgroundColor: constants.chartColors[1],
      },
    ],
  };
  return (
    <div>
      <p>
        Ne pouvant suivre tous les usages du site, nous avons choisi de nous
        concentrer sur le suivi des usages liés à la simplification des
        démarches en lignes.
      </p>
      <p>
        Nous suivons en particulier l’utilisation du copier-coller et le nombre
        de siren/siret utilisés directement dans le moteur de recherche, car ces
        deux indicateurs sont corrélés à l’application du{' '}
        <b>Dites-Le-Nous-Une-Fois</b> (DLNUF).
      </p>
      <LineChart height="300px" data={data} />
      <br />
      <div className="chart-container">
        <div>
          <p>
            <b>Le copier-coller</b> sert majoritairement à copier le numéro
            siren/siret. Beaucoup d’entrepreneurs ne connaissent pas leur numéro
            par coeur et l’Annuaire des Entreprise les aide à le retrouver, en
            particulier dans le cadre d’une démarche administrative.
          </p>
          <p>
            Du côté des administrations publiques, <b>le numéro siren/siret</b>{' '}
            est l’identifiant systématiquement utilisé pour identifier une
            entreprises lors d’une démarche. Pour traiter un dossier, un{' '}
            <b>agent public</b> peut coller le siren/siret directement dans la
            recherche et retrouver immédiatement la fiche publique de
            l’entreprise concernée.
          </p>
        </div>
        <div>
          <DoughnutChart
            height="200px"
            data={{
              labels: mostCopied.map((el) => el.label),
              datasets: [
                {
                  label: 'Nombre de copier-coller',
                  data: mostCopied.map((el) => el.count),
                  backgroundColor: constants.chartColors,
                  borderColor: 'transparent',
                  hoverOffset: 4,
                },
              ],
            }}
            pluginOptions={{
              tooltip: {
                callbacks: {
                  label(context) {
                    const safeData = context.dataset.data as number[];
                    const total = safeData.reduce(
                      (previousValue, currentValue) => {
                        return previousValue + currentValue;
                      },
                      0
                    );
                    return Math.round((context.parsed * 100) / total) + '%';
                  },
                },
              },
              title: {
                display: true,
                text: 'Ci-dessus : répartition des données les plus copiées-collées.',
                position: 'bottom',
                align: 'center',
              },
              legend: {
                position: 'right',
                align: 'start',
              },
            }}
          />
        </div>
      </div>
      <style jsx>{`
        .chart-container {
          display: flex;
          align-items: center;
        }
        .chart-container > div {
          flex-grow: 1;
        }

        @media only screen and (min-width: 992px) {
          .chart-container > div:first-of-type {
            max-width: 60%;
          }
        }

        @media only screen and (min-width: 1px) and (max-width: 992px) {
          .chart-container {
            flex-direction: column;
          }
          .chart-container > div {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
