import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { hasAidesADEME, type IUniteLegale } from "#models/core/types";

export const FinancesSocieteSummary = ({
  shouldShowOnlyAides,
  session,
  uniteLegale,
}: {
  shouldShowOnlyAides: boolean;
  session: ISession | null;
  uniteLegale: IUniteLegale;
}) => (
  <nav aria-labelledby="finances-societe-summary-title">
    <strong id="finances-societe-summary-title">
      Informations financières disponibles :
    </strong>
    <ul>
      {!shouldShowOnlyAides && (
        <>
          <li>
            <a href="#indicateurs-financiers">Indicateurs financiers</a>
          </li>
          {hasRights(session, ApplicationRights.bilansBDF) && (
            <li>
              <a href="#indicateurs-financiers-banque-de-france">
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
        </>
      )}
      <li>
        <a href="#aides-minimis">Aides Minimis</a>
      </li>
      {hasAidesADEME(uniteLegale) && (
        <li>
          <a href="#aides-ademe">Aides ADEME</a>
        </li>
      )}
    </ul>
    <br />
  </nav>
);
