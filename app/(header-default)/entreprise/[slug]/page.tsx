import { HttpError } from "#clients/exceptions";
import type { IUniteLegale } from "#models/core/types";
import extractParamsAppRouter, {
  type AppRouterProps,
} from "#utils/server-side-helper/extract-params";

// export const generateMetadata = async (
//   props: AppRouterProps
// ): Promise<Metadata> => {
//   const { slug, page, isBot } = await extractParamsAppRouter(props);

//   const uniteLegale = await cachedGetUniteLegale(slug, isBot, page);
//   return {
//     title: uniteLegalePageTitle(uniteLegale),
//     description: uniteLegalePageDescription(uniteLegale),
//     robots: shouldNotIndex(uniteLegale) ? "noindex, nofollow" : "index, follow",
//     ...(uniteLegale.chemin && {
//       alternates: {
//         canonical: `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`,
//       },
//     }),
//   };
// };

async function getUniteLegale(withRetry: boolean) {
  try {
    const response = await fetch(
      "https://staging.recherche-entreprises.api.gouv.fr/search?q=931787980&limite_matching_etablissements=3&include_admin=slug,etablissements,immatriculation&page_etablissements=1&mtm_campaign=annuaire-entreprises-site"
      // {
      //   cache: "no-cache",
      // }
    );

    if (!response.ok) {
      throw new HttpError(response.statusText, response.status);
    }

    return (await response.json()) as IUniteLegale;
  } catch (error) {
    if (withRetry) {
      return await getUniteLegale(false);
    }
    throw error;
  }
}

export default async function UniteLegalePage(props: AppRouterProps) {
  const { slug, page, isBot, isRedirected } =
    await extractParamsAppRouter(props);
  const uniteLegale = await getUniteLegale(true);

  return null;
}
