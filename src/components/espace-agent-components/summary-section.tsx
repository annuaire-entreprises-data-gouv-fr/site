import { Link } from "#/components/Link";
import { Section } from "#/components/section";
import { TwoColumnTable } from "#/components/table/simple";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { Icon } from "#/components-ui/icon/wrapper";
import { PrintNever } from "#/components-ui/print-visibility";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";

interface IProps {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}

export const EspaceAgentSummarySection = ({ uniteLegale, user }: IProps) => (
  <PrintNever>
    <Section isProtected title="Résumé pour les agents publics">
      <TwoColumnTable
        body={[
          [
            "Documents juridiques",
            <Link
              hash="actes"
              params={{ slug: uniteLegale.siren }}
              to="/documents/$slug"
            >
              → Consulter les Actes et les Statuts constitutifs
            </Link>,
          ],
          ["", <br />],
          [
            <>Données financières</>,
            <Link
              params={{ slug: uniteLegale.siren }}
              to="/donnees-financieres/$slug"
            >
              → Consulter les indicateurs financiers
            </Link>,
          ],
          [
            "",
            <Link
              hash="bilans"
              params={{ slug: uniteLegale.siren }}
              to="/donnees-financieres/$slug"
            >
              <Icon slug="download">Télécharger les bilans</Icon>
            </Link>,
          ],
          ...(hasRights({ user }, ApplicationRights.conformiteSociale)
            ? [
                ["", <br />],
                [
                  "Conformité",
                  <Link
                    hash="conformite-sociale"
                    params={{ slug: uniteLegale.siren }}
                    to="/documents/$slug"
                  >
                    → Attestations de conformité sociale
                  </Link>,
                ],
              ]
            : []),
          ...(hasRights({ user }, ApplicationRights.conformiteFiscale)
            ? [
                ["", <br />],
                [
                  "Conformité",
                  <Link
                    hash="conformite-fiscale"
                    params={{ slug: uniteLegale.siren }}
                    to="/documents/$slug"
                  >
                    → Attestation de conformité fiscale
                  </Link>,
                ],
              ]
            : []),
          ...(hasRights({ user }, ApplicationRights.travauxPublics)
            ? [
                [
                  "Travaux",
                  <Link
                    hash="travaux-publics"
                    params={{ slug: uniteLegale.siren }}
                    to="/documents/$slug"
                  >
                    → Justificatifs relatifs aux entreprises de travaux publics
                  </Link>,
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
