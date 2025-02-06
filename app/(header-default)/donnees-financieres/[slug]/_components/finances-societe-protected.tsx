'use client';

import FAQLink from '#components-ui/faq-link';
import { DGFiP } from '#components/administrations';
import { LineChart } from '#components/chart/line';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import constants from '#models/constants';
import { IUniteLegale } from '#models/core/types';
import {
  formatCurrency,
  formatDate,
  formatDateYear,
  pluralize,
} from '#utils/helpers';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

const ColorCircle = ({ color }: { color: string }) => (
  <span style={{ color }}>◆</span>
);
const colorCA = constants.chartColors[4];

export default function FinancesSocieteProtectedSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const chiffreAffairesProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentChiffreAffairesProtected,
    uniteLegale.siege.siret,
    session
  );

  return (
    <AsyncDataSectionClient
      title="Indicateurs financiers"
      sources={[EAdministration.DGFIP]}
      data={chiffreAffairesProtected}
      isProtected
      notFoundInfo="Aucun indicateur financier n’a été retrouvé pour cette structure."
    >
      {(chiffreAffairesProtected) => {
        const body = [
          [
            'Date de clôture',
            ...chiffreAffairesProtected.map(
              (a) => formatDate(a.dateFinExercice) ?? ''
            ),
          ],
          [
            <>
              <ColorCircle color={colorCA} /> Chiffre d’affaires
            </>,
            ...chiffreAffairesProtected.map((a) =>
              formatCurrency(a.chiffreAffaires ?? '')
            ),
          ],
        ];
        const plural = pluralize(chiffreAffairesProtected);

        return (
          <>
            <p>
              Les comptes annuels de cette entreprise n’étant pas publics, voici
              le{plural} chiffre
              {plural} d’affaires récupéré
              {plural} auprès de la <DGFiP />
              &nbsp;:
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
                labels: chiffreAffairesProtected.map((ca) =>
                  formatDateYear(ca.year.toString())
                ),
                datasets: [
                  {
                    label: "Chiffre d'affaires",
                    tension: 0.3,
                    data: chiffreAffairesProtected.map(
                      (ca) => ca.chiffreAffaires ?? ''
                    ),
                    borderColor: colorCA,
                    backgroundColor: colorCA,
                  },
                ],
              }}
            />
            <br />
            <FullTable
              head={[
                <FAQLink
                  tooltipLabel="Indicateurs"
                  to="/faq/donnees-financieres"
                >
                  Définition des indicateurs
                </FAQLink>,
                ...chiffreAffairesProtected.map((ca) => ca.year.toString()),
              ]}
              body={body}
            />
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}
