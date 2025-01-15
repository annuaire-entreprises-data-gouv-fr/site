import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import { estDiffusible } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import BilansDocumentsSociete from './bilans-documents-societe';
import BilansSocieteSection from './bilans-societe';
import ComptesBodaccSociete from './comptes-bodacc-societe';
import { FinancesSocieteSection } from './finances-societe';

export default function DonneesFinancieresSociete({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const isMoreThanThreeYearsOld =
    new Date(
      uniteLegale.dateDebutActivite || uniteLegale.dateCreation
    ).getFullYear() +
      3 <=
    new Date().getFullYear();

  return (
    <>
      {estDiffusible(uniteLegale) ||
      hasRights(session, ApplicationRights.nonDiffusible) ? (
        <>
          <FinancesSocieteSection uniteLegale={uniteLegale} session={session} />
          {hasRights(session, ApplicationRights.bilans) &&
            isMoreThanThreeYearsOld && (
              <BilansSocieteSection
                uniteLegale={uniteLegale}
                session={session}
              />
            )}
        </>
      ) : (
        <DonneesPriveesSection title="Indicateurs financiers" />
      )}
      <HorizontalSeparator />
      <BilansDocumentsSociete uniteLegale={uniteLegale} session={session} />
      <ComptesBodaccSociete uniteLegale={uniteLegale} />
    </>
  );
}
