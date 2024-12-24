'use client';

import FAQLink from '#components-ui/faq-link';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { formatCurrency, formatDate, getDateFromYYYYMM } from '#utils/helpers';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export const FinancesSocieteBilansSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const banqueDeFranceBilansProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentBanqueDeFranceBilansProtected,
    uniteLegale.siren,
    session
  );

  return (
    <AsyncDataSectionClient
      title="Bilans Banque de France"
      id="bilans-banque-de-france"
      sources={[EAdministration.MEF]}
      isProtected
      data={banqueDeFranceBilansProtected}
      notFoundInfo="Aucun bilan n’a été retrouvé pour cette structure."
    >
      {(bilans) => {
        const body = [
          [
            'Date de clôture',
            ...bilans.map((item) =>
              formatDate(getDateFromYYYYMM(item.date_arrete_exercice || ''))
            ),
          ],
          [
            'Besoin en Fonds de Roulement',
            ...bilans.map((item) =>
              formatCurrency(item.besoin_en_fonds_de_roulement)
            ),
          ],
          [
            'Capacité d’Autofinancement',
            ...bilans.map((item) =>
              formatCurrency(item.capacite_autofinancement)
            ),
          ],
          [
            'Dettes 4 maturité à un an au plus',
            ...bilans.map((item) =>
              formatCurrency(item.dettes4_maturite_a_un_an_au_plus)
            ),
          ],
          [
            'Disponibilités',
            ...bilans.map((item) => formatCurrency(item.disponibilites)),
          ],

          [
            'Excédent Brut d’Exploitation',
            ...bilans.map((item) =>
              formatCurrency(item.excedent_brut_exploitation)
            ),
          ],
          [
            'Fonds de Roulement Net Global',
            ...bilans.map((item) =>
              formatCurrency(item.fonds_roulement_net_global)
            ),
          ],
          [
            'Ratio Fonds de Roulement Net Global sur Besoin en Fonds de Roulement',
            ...bilans.map((item) =>
              formatCurrency(
                item.ratio_fonds_roulement_net_global_sur_besoin_en_fonds_de_roulement
              )
            ),
          ],
          [
            'Total Dettes Stables',
            ...bilans.map((item) => formatCurrency(item.total_dettes_stables)),
          ],
          [
            'Valeur ajoutée BDF',
            ...bilans.map((item) => formatCurrency(item.valeur_ajoutee_bdf)),
          ],
        ];

        return (
          <FullTable
            head={[
              <FAQLink tooltipLabel="Indicateurs" to="/faq/donnees-financieres">
                Définition des indicateurs
              </FAQLink>,
              ...bilans.map((item) => item.annee),
            ]}
            body={body}
          />
        );
      }}
    </AsyncDataSectionClient>
  );
};
