import { IAssociation } from '#models/core/types';
import { ISession } from '#models/user/session';
import ComptesAssociationSection from './comptes-association';
import FinancesAssociationSection from './finances-association';
import SubventionsAssociationSection from './subventions-association';

export default function DonneesFinancieresAssociation({
  uniteLegale,
  session,
}: {
  uniteLegale: IAssociation;
  session: ISession | null;
}) {
  return (
    <>
      <FinancesAssociationSection session={session} uniteLegale={uniteLegale} />
      <SubventionsAssociationSection
        session={session}
        uniteLegale={uniteLegale}
      />
      <ComptesAssociationSection uniteLegale={uniteLegale} />
    </>
  );
}
