import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { estDiffusible } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import BilansDocumentsSociete from './bilans-documents-societe';
import BilansSocieteSection from './bilans-societe';
import ComptesBodaccSociete from './comptes-bodacc-societe';
import { FinancesSocieteSection } from './finances-societe';
import FinancesSocieteLiassesFiscalesSection from './finances-societe-liasses-fiscales';

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
      {hasRights(session, ApplicationRights.liassesFiscales) && (
        <FinancesSocieteLiassesFiscalesSection
          uniteLegale={uniteLegale}
          session={session}
        />
      )}
    </>
  );
}
