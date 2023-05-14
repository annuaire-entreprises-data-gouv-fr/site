import { ChartData } from 'chart.js';
import { LineChart } from '#components/chart/line';
import { PieChart } from '#components/chart/pie';
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
  mostCopied: { [key: string]: number };
}> = ({ redirectedSiren, copyPasteAction, mostCopied }) => {
  const data: ChartData<'line', (number | null)[], string> = {
    labels: redirectedSiren.map((redirected) => redirected.label),
    datasets: [
      {
        label: 'Utilisation du siren/siret dans la recherche',
        tension: 0.3,
        data: redirectedSiren.map((redirected) => redirected.value || null),
        borderColor: constants.chartColors[2],
        backgroundColor: constants.chartColors[2],
      },
      {
        label: 'Utilisation du copier-coller',
        data: copyPasteAction.map((action) => action.value || null),
        tension: 0.3,
        borderColor: constants.chartColors[4],
        backgroundColor: constants.chartColors[4],
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
      <LineChart data={data} />
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
            entreprises lors d’une démarches. Pour traiter un dossier, un{' '}
            <b>agent public</b> qui colle le siren/siret directement dans la
            recherche, retrouve immédiatement la fiche publique de l’entreprise
            concernée.
          </p>
        </div>
        <div>
          <PieChart
            height={'200px'}
            data={{
              labels: Object.keys(mostCopied),
              datasets: [
                {
                  label: 'Nombre de copier-coller',
                  data: Object.values(mostCopied),
                  backgroundColor: constants.chartColors,
                  borderColor: 'transparent',
                  hoverOffset: 4,
                },
              ],
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
        .chart-container > div:first-of-type {
          max-width: 60%;
        }
      `}</style>
    </div>
  );
};
