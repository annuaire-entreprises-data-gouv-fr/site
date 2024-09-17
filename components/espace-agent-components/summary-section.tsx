import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { IUniteLegale } from '#models/core/types';
import { AppScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { NextPageWithLayout } from 'pages/_app';

interface IProps {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}

export const EspaceAgentSummarySection: NextPageWithLayout<IProps> = ({
  uniteLegale,
  session,
}) => {
  return (
    <PrintNever>
      <Section title="Résumé pour les agents publics" isProtected>
        <TwoColumnTable
          body={[
            [
              'Documents juridiques',
              <a href={`/documents/${uniteLegale.siren}#actes`}>
                → Consulter les Actes et les Statuts constitutifs
              </a>,
            ],
            ['', <br />],
            [
              <>Données financières</>,
              <a href={`/donnees-financieres/${uniteLegale.siren}`}>
                → Consulter les indicateurs financiers
              </a>,
            ],
            [
              '',
              <a href={`/donnees-financieres/${uniteLegale.siren}#bilans`}>
                <Icon slug="download">Télécharger les bilans</Icon>
              </a>,
            ],
            ...(hasRights(session, AppScope.conformite)
              ? [
                  ['', <br />],
                  [
                    'Conformité',
                    <a href={`/documents/${uniteLegale.siren}#conformite`}>
                      → Consulter les attestations fiscales et sociales
                    </a>,
                  ],
                ]
              : []),
          ]}
        />
      </Section>
      <HorizontalSeparator />
    </PrintNever>
  );
};

export default EspaceAgentSummarySection;
