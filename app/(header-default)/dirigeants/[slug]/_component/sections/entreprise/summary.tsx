import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import { ISession } from "#models/authentication/user/session";
import {
  isEntrepreneurIndividuel,
  isServicePublic,
  IUniteLegale,
} from "#models/core/types";

type IDirigeantSummaryProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const DirigeantSummary: React.FC<IDirigeantSummaryProps> = ({
  uniteLegale,
  session,
}) => {
  if (uniteLegale.association.idAssociation) {
    return null;
  }
  if (isServicePublic(uniteLegale)) {
    return null;
  }

  return (
    <nav role="navigation" aria-labelledby="dirigeant-summary-title">
      <strong id="dirigeant-summary-title">
        Informations disponibles sur les dirigeant(s) :
      </strong>
      <ul>
        <li>
          <a href="#rne-dirigeants">
            Liste des dirigeants inscrits au Registre National des Entreprises
            (RNE)
          </a>
        </li>
        {!isEntrepreneurIndividuel(uniteLegale) &&
          hasRights(session, ApplicationRights.liensCapitalistiques) && (
            <li>
              <a href="#liens-capitalistiques">
                Liste des liens capitalistiques
              </a>
            </li>
          )}
        <li>
          <a href="#beneficiaires">Liste des bénéficiaires effectifs</a>
        </li>
        <li>
          <a href="#dpo-section">Délégué à la Protection des Données (DPO)</a>
        </li>
      </ul>
      <br />
    </nav>
  );
};

export default DirigeantSummary;
