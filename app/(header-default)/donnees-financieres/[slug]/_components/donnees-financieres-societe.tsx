import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { DonneesPriveesSection } from '#components/donnees-privees-section';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { estDiffusible } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import BilansBDFSociete from './bilans-bdf-societe';
import BilansDocumentsSociete from './bilans-documents-societe';
import ComptesBodaccSociete from './comptes-bodacc-societe';
import { FinancesSocieteSection } from './finances-societe';
import { FinancesSocieteSummary } from './finances-societe-summary';
import LiassesFiscalesSection from './liasses-fiscales';

export default function DonneesFinancieresSociete({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  return (
    <>
      <FinancesSocieteSummary session={session} />
      {estDiffusible(uniteLegale) ||
      hasRights(session, ApplicationRights.nonDiffusible) ? (
        <FinancesSocieteSection uniteLegale={uniteLegale} session={session} />
      ) : (
        <DonneesPriveesSection title="Indicateurs financiers" />
      )}
      {hasRights(session, ApplicationRights.bilansBDF) && (
        <>
          <HorizontalSeparator />
          <BilansBDFSociete uniteLegale={uniteLegale} session={session} />
        </>
      )}
      <BilansDocumentsSociete uniteLegale={uniteLegale} session={session} />
      <HorizontalSeparator />
      <ComptesBodaccSociete uniteLegale={uniteLegale} />
      <LiassesFiscalesSection uniteLegale={uniteLegale} session={session} />
    </>
  );
}
