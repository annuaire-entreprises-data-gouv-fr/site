import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';

export const FinancesSocieteSummary = ({
  session,
}: {
  session: ISession | null;
}) => (
  <nav role="navigation" aria-labelledby="finances-societe-summary-title">
    <strong id="finances-societe-summary-title">
      Informations financières disponibles :
    </strong>
    <ul>
      <li>
        <a href="#finances-association">Indicateurs financiers</a>
      </li>
      {hasRights(session, ApplicationRights.bilansBDF) && (
        <li>
          <a href="#finances-association">
            Indicateurs financiers de la Banque de France
          </a>
        </li>
      )}
      <li>
        <a href="#bilans-pdf">Bilans au format PDF</a>
      </li>
      <li>
        <a href="#comptes-bodacc">Dépôts de comptes au BODACC</a>
      </li>
      {hasRights(session, ApplicationRights.liassesFiscales) && (
        <li>
          <a href="#liasses-fiscales">Liasses fiscales</a>
        </li>
      )}
    </ul>
    <br />
  </nav>
);
