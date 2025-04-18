'use client';

import { DJEPVA } from '#components/administrations';
import { LineChart } from '#components/chart/line';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import constants from '#models/constants';
import { IAssociation } from '#models/core/types';
import { formatCurrency } from '#utils/helpers';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

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
export default function FinancesAssociationSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IAssociation;
  session: ISession | null;
}) {
  const data = useAPIRouteData(
    APIRoutesPaths.Association,
    uniteLegale.siren,
    session
  );
  if (!data) return null;

  return (
    <DataSectionClient
      id="finances-association"
      notFoundInfo="Aucun indicateur financier n’a été retrouvé pour cette association."
      title="Indicateurs financiers"
      sources={[EAdministration.DJEPVA]}
      data={data}
    >
      {(data) =>
        data?.bilans.length === 0 ? (
          <>
            Aucun indicateur financier n’a été retrouvé pour cette association.
          </>
        ) : (
          <>
            <p>
              Voici les résultats financiers déclarés par le siège social de
              l’association. Ils sont diffusés par la <DJEPVA />.
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
                labels: data.bilans.map((bilan) => bilan.year),
                datasets: [
                  {
                    label: 'Produit',
                    tension: 0.3,
                    data: data.bilans.map((bilan) => bilan.produits ?? 0),
                    borderColor: colorCA,
                    backgroundColor: colorCA,
                  },
                  {
                    label: 'Resultat',
                    tension: 0.3,
                    data: data.bilans.map((bilan) => bilan.resultat ?? 0),
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
                ...data.bilans.map((a) => a?.year.toString()),
              ]}
              body={[
                [
                  <>
                    <ColorCircle color={colorCA} /> Total des produits
                  </>,
                  ...data.bilans.map((a) => formatCurrency(a?.produits ?? '')),
                ],
                [
                  'Total des charges',
                  ...data.bilans.map((a) => formatCurrency(a?.charges ?? '')),
                ],
                [
                  'Montants des dons perçus',
                  ...data.bilans.map((a) => formatCurrency(a?.dons ?? '')),
                ],
                [
                  'Montants des subventions perçues',
                  ...data.bilans.map((a) => formatCurrency(a?.subv ?? '')),
                ],
                [
                  <>
                    <ColorCircle color={colorResultat} /> Résultat
                  </>,
                  ...data.bilans.map((a) => formatCurrency(a?.resultat ?? '')),
                ],
              ]}
            />
          </>
        )
      }
    </DataSectionClient>
  );
}
