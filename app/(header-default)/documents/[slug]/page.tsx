import { Metadata } from 'next';
import { PrintNever } from '#components-ui/print-visibility';
import ConformiteSection from '#components/espace-agent-components/conformite-section';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { EScope, hasRights } from '#models/user/rights';
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import ActesSection from './_components/actes';
import CarteProfessionnelleTPSection from './_components/carte-professionnelle-TP-section';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const session = await getSession();

  return {
    title: `Documents, Actes et statuts - ${uniteLegalePageTitle(
      uniteLegale,
      session
    )}`,
    description: uniteLegalePageDescription(uniteLegale, session),
    robots: 'noindex',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/documents/${
        uniteLegale.chemin || uniteLegale.siren
      }`,
    },
  };
};

const UniteLegaleDocumentPage = async (props: AppRouterProps) => {
  const session = await getSession();
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  return (
    <>
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.DOCUMENTS}
          session={session}
        />
        <PrintNever>
          Documents disponibles pour cette structure :
          <ul>
            {hasRights(session, EScope.conformite) && (
              <li>
                <a href="#conformite">Attestations de conformite</a>
              </li>
            )}
            <li>
              <a href="#actes">Actes et statuts</a>
            </li>
            {hasRights(session, EScope.carteProfessionnelleTravauxPublics) && (
              <li>
                <a href="#carte-professionnelle-travaux-publics">
                  Carte professionnelle travaux publics
                </a>
              </li>
            )}
          </ul>
          {hasRights(session, EScope.conformite) && (
            <ConformiteSection session={session} uniteLegale={uniteLegale} />
          )}
          <ActesSection uniteLegale={uniteLegale} session={session} />
          {hasRights(session, EScope.carteProfessionnelleTravauxPublics) && (
            <CarteProfessionnelleTPSection
              session={session}
              uniteLegale={uniteLegale}
            />
          )}
        </PrintNever>
      </div>
    </>
  );
};

export default UniteLegaleDocumentPage;
