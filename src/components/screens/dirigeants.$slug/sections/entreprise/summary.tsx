import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import {
  type IUniteLegale,
  isEntrepreneurIndividuel,
  isServicePublic,
} from "#/models/core/types";

interface IDirigeantSummaryProps {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}

const DirigeantSummary: React.FC<IDirigeantSummaryProps> = ({
  uniteLegale,
  user,
}) => {
  if (uniteLegale.association.idAssociation) {
    return null;
  }
  if (isServicePublic(uniteLegale)) {
    return null;
  }

  return (
    <nav aria-labelledby="dirigeant-summary-title">
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
          hasRights({ user }, ApplicationRights.liensCapitalistiques) && (
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
