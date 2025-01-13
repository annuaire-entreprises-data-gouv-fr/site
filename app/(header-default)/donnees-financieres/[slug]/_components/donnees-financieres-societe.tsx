import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import { estDiffusible } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import BilansDocumentsSociete from './bilans-documents-societe';
import { FinancesSocieteBilansSection } from './bilans-societe';
import ComptesBodacc from './bodacc';
import { FinancesSocieteSection } from './finances-societe';

const DonneesFinancieresSociete = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  const isMoreThanThreeYearsOld =
    new Date(uniteLegale.dateDebutActivite).getFullYear() + 3 <=
    new Date().getFullYear();

  return (
    <>
      {estDiffusible(uniteLegale) ||
      hasRights(session, ApplicationRights.nonDiffusible) ? (
        <>
          <FinancesSocieteSection uniteLegale={uniteLegale} session={session} />
          {hasRights(session, ApplicationRights.bilans) &&
            isMoreThanThreeYearsOld && (
              <FinancesSocieteBilansSection
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
      <ComptesBodacc uniteLegale={uniteLegale} />
    </>
  );
};

export default DonneesFinancieresSociete;
