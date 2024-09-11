import { Metadata } from 'next';
import MatomoEventFromRedirected from '#components/matomo-event/search-redirected';
import StructuredDataBreadcrumb from '#components/structured-data/breadcrumb';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import constants from '#models/constants';
import {
  shouldNotIndex,
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from '#utils/helpers';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { EtablissementsSection } from './_components/etablissements-section';

// export const generateMetadata = async function (
//   props: AppRouterProps
// ): Promise<Metadata> {
//   const { slug, isBot } = extractParamsAppRouter(props);
//   const { uniteLegale, etablissement } =
//     await cachedEtablissementWithUniteLegale(slug, isBot);

//   const title = `${
//     etablissement.estSiege ? 'Siège social' : 'Etablissement secondaire'
//   } - ${etablissementPageTitle(etablissement, uniteLegale)}`;

//   return {
//     title,
//     description: etablissementPageDescription(etablissement, uniteLegale),
//     robots: shouldNotIndex(uniteLegale) ? 'noindex, nofollow' : 'index, follow',
//     alternates: {
//       canonical: `https://annuaire-entreprises.data.gouv.fr/etablissement/${etablissement.siret}`,
//     },
//   };
// };

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { slug, page, isBot } = extractParamsAppRouter(props);

  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);
  return {
    title: uniteLegalePageTitle(uniteLegale),
    description: uniteLegalePageDescription(uniteLegale),
    robots: shouldNotIndex(uniteLegale) ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: `https://annuaire-entreprises.data.gouv.fr/entreprise/${
        uniteLegale.chemin || uniteLegale.siren
      }`,
    },
  };
};

export default async function UniteLegalePage(props: AppRouterProps) {
  const { slug, page, isBot, isRedirected } = extractParamsAppRouter(props);
  const session = await getSession();
  const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);
  const {
    usePagination,
    nombreEtablissements,
    nombreEtablissementsOuverts,
    currentEtablissementPage,
  } = uniteLegale.etablissements;

  const totalPages = Math.ceil(
    nombreEtablissements / constants.resultsPerPage.etablissements
  );

  const plural = nombreEtablissements > 1 ? 's' : '';
  const pluralBe = nombreEtablissementsOuverts > 1 ? 'sont' : 'est';

  return (
    <>
      {isRedirected && (
        <MatomoEventFromRedirected sirenOrSiret={uniteLegale.siren} />
      )}
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.ETABLISSEMENTS}
          session={session}
        />

        <p>
          Cette structure possède{' '}
          <strong>
            {nombreEtablissements} établissement{plural}
          </strong>
          {nombreEtablissementsOuverts && !usePagination ? (
            <>
              {' '}
              dont {nombreEtablissementsOuverts} {pluralBe} en activité
            </>
          ) : null}
          . Cliquez sur un n° SIRET pour obtenir plus d’information :
        </p>
        <EtablissementsSection
          uniteLegale={uniteLegale}
          initialSelectedSiret={uniteLegale.siege.siret}
        />
      </div>
      <StructuredDataBreadcrumb uniteLegale={uniteLegale} />
    </>
  );
}

// <div className="content-container">
//                       <div>
//                         {etablissement.oldSiret &&
//                           etablissement.oldSiret !== etablissement.siret && (
//                             <Warning full>
//                               Cet établissement est inscrit en double à l’
//                               <INSEE /> : {formatSiret(
//                                 etablissement.oldSiret
//                               )}{' '}
//                               et {formatSiret(etablissement.siret)}. Pour voir
//                               les informations complètes, consultez la page{' '}
//                               <a
//                                 href={`/etablissements/${etablissement.siret}`}
//                               >
//                                 {formatSiret(etablissement.siret)}
//                               </a>
//                               .
//                             </Warning>
//                           )}

//                         <TitleAlerts
//                           uniteLegale={uniteLegale}
//                           session={session}
//                           statutDiffusion={etablissement.statutDiffusion}
//                         />

//                         <h1>
//                           Établissement{' '}
//                           {etablissement.enseigne ||
//                             etablissement.denomination ||
//                             uniteLegale.nomComplet}{' '}
//                           {etablissement.commune && (
//                             <>
//                               à{' '}
//                               <a
//                                 href={`/etablissements/${etablissement.siret}`}
//                               >
//                                 {etablissement.commune}
//                               </a>
//                             </>
//                           )}
//                         </h1>

//                         <div>
//                           <span>{formatSiret(etablissement.siret)}</span>
//                           {!estDiffusible(etablissement) && (
//                             <Tag color="new">non-diffusible</Tag>
//                           )}
//                           <IsActiveTag
//                             etatAdministratif={etablissement.etatAdministratif}
//                             statutDiffusion={etablissement.statutDiffusion}
//                             since={etablissement.dateFermeture}
//                           />
//                         </div>
//                         <div>
//                           <span>Cet établissement est </span>
//                           {etablissement.estSiege ? (
//                             <>
//                               le{' '}
//                               <Tag color="info" size="small">
//                                 siège social
//                               </Tag>
//                             </>
//                           ) : etablissement.ancienSiege ? (
//                             <>
//                               un<Tag size="small">ancien siège social</Tag>
//                             </>
//                           ) : (
//                             <Tag size="small">un établissement secondaire</Tag>
//                           )}
//                           <span>
//                             {' '}
//                             {uniteLegaleLabelWithPronounContracted(
//                               uniteLegale
//                             )}{' '}
//                             <a href={`/entreprise/${uniteLegale.siren}`}>
//                               {uniteLegale.nomComplet}&nbsp;‣&nbsp;
//                               <span>{formatIntFr(uniteLegale.siren)}</span>
//                             </a>
//                             <IsActiveTag
//                               etatAdministratif={uniteLegale.etatAdministratif}
//                               statutDiffusion={uniteLegale.statutDiffusion}
//                               size="small"
//                             />
//                           </span>
//                         </div>
//                         <br />
//                         {estNonDiffusibleStrict(etablissement) ? (
//                           <p>
//                             Les informations concernant cette entreprise ne sont
//                             pas publiques.
//                           </p>
//                         ) : (
//                           <EtablissementDescription
//                             etablissement={etablissement}
//                             uniteLegale={uniteLegale}
//                             session={session}
//                           />
//                         )}
//                       </div>
//                       <br />
//                       {estNonDiffusibleStrict(uniteLegale.siege) ? (
//                         <NonDiffusibleSection />
//                       ) : (
//                         <EtablissementSection
//                           etablissement={uniteLegale.siege}
//                           uniteLegale={uniteLegale}
//                           session={session}
//                           withDenomination={true}
//                           usedInEntreprisePage={false}
//                         />
//                       )}
//                       {!isBot && isServicePublic(uniteLegale) && (
//                         <ServicePublicSection
//                           uniteLegale={uniteLegale}
//                           etablissement={uniteLegale.siege}
//                         />
//                       )}
//                     </div>

// <PageCounter
// currentPage={currentEtablissementPage || 1}
// totalPages={totalPages}
// urlComplement="#etablissements"
// />
