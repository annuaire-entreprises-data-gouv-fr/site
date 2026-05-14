import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { hasAidesADEME, type IUniteLegale } from "#/models/core/types";

export const FinancesSocieteSummary = ({
  shouldShowOnlyAides,
  user,
  uniteLegale,
}: {
  shouldShowOnlyAides: boolean;
  user: IAgentInfo | null;
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
          {hasRights({ user }, ApplicationRights.bilansBDF) && (
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
          {hasRights({ user }, ApplicationRights.liassesFiscales) && (
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
