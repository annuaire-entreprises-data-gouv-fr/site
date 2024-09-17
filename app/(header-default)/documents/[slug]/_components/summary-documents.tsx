import { AppScope, hasRights } from '#models/user/rights';
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
      {hasRights(session, AppScope.conformite) && (
        <li>
          <a href="#conformite">Attestations de conformite</a>
        </li>
      )}
      <li>
        <a href="#actes">Actes et statuts</a>
      </li>
      {hasRights(session, AppScope.carteProfessionnelleTravauxPublics) && (
        <li>
          <a href="#carte-professionnelle-travaux-publics">
            Carte professionnelle travaux publics
          </a>
        </li>
      )}
    </ul>
  </nav>
);
