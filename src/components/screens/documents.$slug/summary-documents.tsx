import type { ReactNode } from "react";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";

export const SummaryDocuments = ({
  user,
  additionalSummaryItems,
  showUniteLegaleDocuments = true,
}: {
  user: IAgentInfo | null;
  additionalSummaryItems?: ReactNode;
  showUniteLegaleDocuments?: boolean;
}) => (
  <nav aria-labelledby="document-summary-title">
    <strong id="document-summary-title">Documents disponibles :</strong>
    <ul>
      {additionalSummaryItems}
      {showUniteLegaleDocuments && (
        <>
          <li>
            <a href="#justificatifs">Justificatifs d’immatriculation</a>
          </li>
          {hasRights({ user }, ApplicationRights.conformiteSociale) && (
            <li>
              <a href="#conformite-sociale">
                Attestations de conformité sociale
              </a>
            </li>
          )}
          {hasRights({ user }, ApplicationRights.conformiteFiscale) && (
            <li>
              <a href="#conformite-fiscale">
                Attestation de conformité fiscale
              </a>
            </li>
          )}
          <li>
            <a href="#actes">Actes et statuts</a>
          </li>
          {hasRights({ user }, ApplicationRights.travauxPublics) && (
            <li>
              <a href="#travaux-publics">
                Justificatifs et certificats relatifs aux entreprises de travaux
                publics
              </a>
            </li>
          )}
        </>
      )}
    </ul>
  </nav>
);
