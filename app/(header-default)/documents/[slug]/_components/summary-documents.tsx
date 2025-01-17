import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';

export const SummaryDocuments = ({ session }: { session: ISession | null }) => (
  <nav role="navigation" aria-labelledby="document-summary-title">
    <strong id="document-summary-title">
      Documents disponibles pour cette structure :
    </strong>
    <ul>
      <li>
        <a href="#justificatifs">Justificatifs d’immatriculation</a>
      </li>
      {hasRights(session, ApplicationRights.conformite) && (
        <li>
          <a href="#conformite">
            Attestations de conformité sociale et fiscale
          </a>
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
