import FAQLink from '#components-ui/faq-link';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
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
              <FAQLink
                tooltipLabel="Immatriculation au RNE"
                to="https://www.inpi.fr/le-registre-national-des-entreprises"
              >
                Depuis le 1er Janvier 2023, toute entreprise exerçant sur le
                territoire français (sauf Polynésie française,
                Nouvelle-Calédonie et Wallis et Futuna) une activité de nature
                commerciale, artisanale, agricole ou indépendante est
                enregistrée au RNE.
              </FAQLink>,
              <a
                href={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
              >
                <Icon slug="download">
                  Télécharger l’extrait d’immatriculation au RNE
                </Icon>
              </a>,
            ],
            [
              '',

              <a href={`/dirigeants/${uniteLegale.siren}`}>
                → Consulter la page dirigeants & le registre des bénéficiaires
                effectifs
              </a>,
            ],
            ['', <br />],
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
            ...(hasRights(session, EScope.conformite)
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
