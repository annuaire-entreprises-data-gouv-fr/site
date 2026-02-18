import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";

export const SummaryDocuments = ({ session }: { session: ISession | null }) => (
  <nav aria-labelledby="document-summary-title" role="navigation">
    <strong id="document-summary-title">Documents disponibles :</strong>
    <ul>
      <li>
        <a href="#justificatifs">Justificatifs d’immatriculation</a>
      </li>
      {hasRights(session, ApplicationRights.conformiteSociale) && (
        <li>
          <a href="#conformite-sociale">Attestations de conformité sociale</a>
        </li>
      )}
      {hasRights(session, ApplicationRights.conformiteFiscale) && (
        <li>
          <a href="#conformite-fiscale">Attestations de conformité fiscale</a>
        </li>
      )}
      <li>
        <a href="#actes">Actes et statuts</a>
      </li>
      {hasRights(session, ApplicationRights.travauxPublics) && (
        <li>
          <a href="#travaux-publics">
            Justificatifs et certificats relatifs aux entreprises de travaux
            publics
          </a>
        </li>
      )}
    </ul>
  </nav>
);
