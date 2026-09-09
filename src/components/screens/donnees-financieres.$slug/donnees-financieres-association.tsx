import type { ReactNode } from "react";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import type { IAgentInfo } from "#/models/authentication/agent";
import { hasAidesADEME, type IAssociation } from "#/models/core/types";
import { AidesADEME } from "./aides-ademe";
import { AidesMinimis } from "./aides-minimis";
import ComptesAssociationSection from "./comptes-association";
import FinancesAssociationSection from "./finances-association";
import SubventionsAssociationSection from "./subventions-association";

export default function DonneesFinancieresAssociation({
  uniteLegale,
  user,
  additionalSummaryItems,
  children,
}: {
  additionalSummaryItems?: ReactNode;
  children?: ReactNode;
  user: IAgentInfo | null;
  uniteLegale: IAssociation;
}) {
  return (
    <>
      <nav aria-labelledby="finances-association-summary-title">
        <strong id="finances-association-summary-title">
          Informations financières disponibles :
        </strong>
        <ul>
          {additionalSummaryItems}
          <li>
            <a href="#finances-association">Indicateurs financiers</a>
          </li>
          <li>
            <a href="#comptes-association">Dépôts de comptes</a>
          </li>
          <li>
            <a href="#detail-des-subventions">Subventions reçues</a>
          </li>
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
      {children}
      <FinancesAssociationSection uniteLegale={uniteLegale} />
      <ComptesAssociationSection uniteLegale={uniteLegale} />
      <HorizontalSeparator />
      <SubventionsAssociationSection uniteLegale={uniteLegale} />
      <AidesMinimis uniteLegale={uniteLegale} user={user} />
      <AidesADEME uniteLegale={uniteLegale} />
    </>
  );
}
