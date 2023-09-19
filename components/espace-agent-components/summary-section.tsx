import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { ProtectedSection } from '#components/section/protected-section';
import { TwoColumnTable } from '#components/table/simple';
import { IUniteLegale } from '#models/index';
import { NextPageWithLayout } from 'pages/_app';

interface IProps {
  uniteLegale: IUniteLegale;
}

export const EspaceAgentSummarySection: NextPageWithLayout<IProps> = ({
  uniteLegale,
}) => {
  return (
    <PrintNever>
      <ProtectedSection title="Conformité & Immatriculation">
        <TwoColumnTable
          body={[
            [
              'Conformité',
              <a href={`/espace-agent/conformite/${uniteLegale.siren}`}>
                → Consulter les attestations fiscales et sociales
              </a>,
            ],
            [
              'Dirigeants et registre des bénéficiaires effectifs',
              <a href={`/dirigeants/${uniteLegale.siren}`}>
                → Consulter la page dirigeants
              </a>,
            ],
            [
              <FAQLink tooltipLabel="Immatriculation au RNE">
                Depuis le 1er Janvier 2023, toute entreprise exerçant sur le
                territoire français (sauf Polynésie française,
                Nouvelle-Calédonie et Wallis et Futuna) une activité de nature
                commerciale, artisanale, agricole ou indépendante est
                enregistrée au RNE.
                <br />
                <a href="https://www.inpi.fr/le-registre-national-des-entreprises">
                  → En savoir plus
                </a>
              </FAQLink>,
              <a href={`/justificatif/${uniteLegale.siren}`}>
                → Consulter la page justificatif d’immatriculation
              </a>,
            ],
            [
              '',
              <a
                href={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
              >
                <Icon slug="download">
                  Télécharger l’extrait d’immatriculation au RNE
                </Icon>
              </a>,
            ],
            ['', <br />],
            [
              <>Données financières</>,
              <a href={`/donnees-financieres/${uniteLegale.siren}`}>
                → Consulter les derniers bilans
              </a>,
            ],
          ]}
        />
      </ProtectedSection>
      <HorizontalSeparator />
    </PrintNever>
  );
};

export default EspaceAgentSummarySection;
