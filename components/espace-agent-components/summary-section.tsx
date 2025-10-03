import { Section } from "#components/section";
import { TwoColumnTable } from "#components/table/simple";
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import { Icon } from "#components-ui/icon/wrapper";
import { PrintNever } from "#components-ui/print-visibility";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";

interface IProps {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}

export const EspaceAgentSummarySection = ({ uniteLegale, session }: IProps) => (
  <PrintNever>
    <Section isProtected title="Résumé pour les agents publics">
      <TwoColumnTable
        body={[
          [
            "Documents juridiques",
            <a href={`/documents/${uniteLegale.siren}#actes`}>
              → Consulter les Actes et les Statuts constitutifs
            </a>,
          ],
          ["", <br />],
          [
            <>Données financières</>,
            <a href={`/donnees-financieres/${uniteLegale.siren}`}>
              → Consulter les indicateurs financiers
            </a>,
          ],
          [
            "",
            <a href={`/donnees-financieres/${uniteLegale.siren}#bilans`}>
              <Icon slug="download">Télécharger les bilans</Icon>
            </a>,
          ],
          ...(hasRights(session, ApplicationRights.conformite)
            ? [
                ["", <br />],
                [
                  "Conformité",
                  <a href={`/documents/${uniteLegale.siren}#conformite`}>
                    → Attestations de conformité fiscales et sociales
                  </a>,
                ],
              ]
            : []),
          ...(hasRights(session, ApplicationRights.travauxPublics)
            ? [
                [
                  "Travaux",
                  <a href={`/documents/${uniteLegale.siren}#travaux-publics`}>
                    → Justificatifs relatifs aux entreprises de travaux publics
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

export default EspaceAgentSummarySection;
