'use client';

import { Info } from '#components-ui/alerts';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { LineChart } from '#components/chart/line';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import constants from '#models/constants';
import { IUniteLegale } from '#models/core/types';
import { hasAnyError, isDataLoading } from '#models/data-fetching';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import {
  formatCurrency,
  formatDate,
  formatDateYear,
  pluralize,
} from '#utils/helpers';
import { useFetchFinancesSociete } from 'hooks';
import { FinancesSocieteProtectedSection } from './finances-societe-protected';

const ColorCircle = ({ color }: { color: string }) => (
  <span style={{ color }}>◆</span>
);
const colorResultat = constants.chartColors[1];
const colorCA = constants.chartColors[4];

export const FinancesSocieteSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const financesSociete = useFetchFinancesSociete(uniteLegale);

  if (
    hasRights(session, ApplicationRights.chiffreAffaires) &&
    !isDataLoading(financesSociete) &&
    hasAnyError(financesSociete)
  ) {
    return (
      <FinancesSocieteProtectedSection
        uniteLegale={uniteLegale}
        session={session}
      />
    );
  }

  return (
    <AsyncDataSectionClient
      title="Indicateurs financiers"
      sources={[EAdministration.MEF]}
      data={financesSociete}
      notFoundInfo="Aucun indicateur financier n’a été retrouvé pour cette structure."
    >
      {(financesSociete) => {
        const bilans = financesSociete.bilans;

        if (
          bilans.find((e) => e.confidentiality !== 'Public') &&
          !hasRights(session, ApplicationRights.bilansRne)
        ) {
          return (
            <Info>
              Les bilans de cette structure sont accompagnés d’une déclaration
              de confidentialité.
              <br />
              Seuls les <strong>agents publics</strong> peuvent les consulter
              sur ce site.
            </Info>
          );
        }
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
          [
            'Marge brute',
            ...bilans.map((a) => formatCurrency(a?.margeBrute ?? '')),
          ],
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
        const plural = pluralize(bilans);

        return (
          <>
            {financesSociete.hasBilanConsolide && (
              <div>
                Cette entreprise déclare un{' '}
                <Tag color="info">bilan consolidé</Tag>. C’est le bilan d’un
                groupe de sociétés dont {uniteLegale.nomComplet} est la société
                mère. Son{' '}
                <FAQLink
                  tooltipLabel="bilan consolidé"
                  to="/faq/donnees-financieres#quest-ce-quun-bilan-consolide"
                >
                  Qu’est-ce qu’un bilan consolidé ?
                </FAQLink>{' '}
                inclut ceux de ses filiales.
              </div>
            )}
            <p>
              Voici les résultats financiers
              {financesSociete.hasBilanConsolide ? ' consolidés' : ''} publiés
              par l’entreprise pour les {bilans.length} dernier
              {plural} exercice
              {plural}&nbsp;:
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
                <FAQLink
                  tooltipLabel="Indicateurs"
                  to="/faq/donnees-financieres"
                >
                  Définition des indicateurs
                </FAQLink>,
                ...bilans.map((a) => a?.year.toString()),
              ]}
              body={body}
            />
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
};
