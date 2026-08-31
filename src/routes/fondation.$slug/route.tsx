import {
  createFileRoute,
  Outlet,
  stripSearchParams,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import z from "zod";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { LeaveFondation } from "#/components/header/leave-fondation";
import { Question } from "#/components/question";
import { NotFound } from "#/components/screens/not-found";
import SocialNetworks from "#/components/social-network";
import { BackToTop } from "#/components-ui/back-to-top";
import type { IUniteLegale } from "#/models/core/types";
import { getRechercheEntrepriseSourcesLastModified } from "#/models/recherche-entreprise-modified";
import { getFondationFromSlugFn } from "#/server-functions/public/fondation";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import { extractSirenFromSiret } from "#/utils/helpers";
import isUserAgentABot from "#/utils/user-agent";
import { HeaderDefaultError } from "./-error";

const loadFondationLayout = createServerFn({ method: "POST" })
  .validator(
    z.object({
      slug: z.string(),
      page: z.number().default(1),
    })
  )
  .handler(async ({ data: { slug, page } }) => {
    const [fondation, sourcesLastModified] = await Promise.all([
      getFondationFromSlugFn({ data: { slug, page } }),
      getRechercheEntrepriseSourcesLastModified(),
    ]);

    let uniteLegale: IUniteLegale | null = null;

    if (fondation.siret) {
      const siren = extractSirenFromSiret(fondation.siret);

      uniteLegale = await getUniteLegaleFromSlugFn({
        data: {
          slug: siren,
          page,
        },
      }).catch(() => null);
    }

    const userAgent = getRequestHeader("user-agent") || "";
    const isBot = isUserAgentABot(userAgent);

    return {
      fondation,
      uniteLegale,
      isBot,
      sourcesLastModified,
    };
  });

export const Route = createFileRoute("/fondation/$slug")({
  validateSearch: z.object({
    page: z.number().min(1).optional().default(1).catch(1),
    from: z
      .union([z.literal("entreprise"), z.literal("fondation")])
      .nullable()
      .default(null)
      .catch(null),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        page: 1,
        from: null,
      }),
    ],
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
  }),
  loader: async ({ params, deps }) => {
    const { slug } = z.object({ slug: z.string() }).parse(params);

    return await loadFondationLayout({
      data: {
        slug,
        page: deps.page,
      },
    });
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
  notFoundComponent: () => <NotFound withWrapper={false} />,
});

function RouteComponent() {
  const { uniteLegale } = Route.useLoaderData();
  const { from } = Route.useSearch();

  const isFromEntrepriseSearch =
    from === "entreprise" || (from === null && !!uniteLegale);

  return (
    <>
      {!isFromEntrepriseSearch && <LeaveFondation />}
      <NPSBanner />
      <BannerManager />
      <Header
        searchPath={
          isFromEntrepriseSearch ? undefined : "/rechercher/fondations"
        }
        searchPlaceholder={
          isFromEntrepriseSearch
            ? undefined
            : "Chercher un fonds ou une fondation"
        }
        useAgentBanner={true}
        useAgentCTA={true}
        useSearchBar={true}
      />
      <main className="fr-container">
        <Outlet />
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  );
}
