import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import type { ISession } from "#models/authentication/user/session";
import type { IAssociation } from "#models/core/types";
import ComptesAssociationSection from "./comptes-association";
import FinancesAssociationSection from "./finances-association";
import SubventionsAssociationSection from "./subventions-association";

export default function DonneesFinancieresAssociation({
  uniteLegale,
  session,
}: {
  uniteLegale: IAssociation;
  session: ISession | null;
}) {
  return (
    <>
      <nav
        role="navigation"
        aria-labelledby="finances-association-summary-title"
      >
        <strong id="finances-associtation-summary-title">
          Informations financières disponibles :
        </strong>
        <ul>
          <li>
            <a href="#finances-association">Indicateurs financiers</a>
          </li>
          <li>
            <a href="#comptes-association">Dépôts de comptes</a>
          </li>
          <li>
            <a href="#detail-des-subventions">Subventions reçues</a>
          </li>
        </ul>
        <br />
      </nav>
      <FinancesAssociationSection session={session} uniteLegale={uniteLegale} />
      <ComptesAssociationSection uniteLegale={uniteLegale} />
      <HorizontalSeparator />
      <SubventionsAssociationSection
        session={session}
        uniteLegale={uniteLegale}
      />
    </>
  );
}
