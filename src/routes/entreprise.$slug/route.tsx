import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
  stripSearchParams,
  useLocation,
} from "@tanstack/react-router";
import { type ReactNode, useMemo } from "react";
import z from "zod";
import { BannerManager } from "#/components/banner/banner-manager";
import { NPSBanner } from "#/components/banner/nps";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { LeaveFondation } from "#/components/header/leave-fondation";
import { Question } from "#/components/question";
import { NotFound } from "#/components/screens/not-found";
import SocialNetworks from "#/components/social-network";
import Title from "#/components/title-section";
import { BackToTop } from "#/components-ui/back-to-top";
import { type IUniteLegale, isFondation } from "#/models/core/types";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import {
  extractSirenOrSiretSlugFromUrl,
  isLikelyASiren,
  isLikelyASiret,
} from "#/utils/helpers/siren-and-siret";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "../_header-default/-error";
import { ENTREPRISE_TAB_TO_FICHE, entrepriseFicheSchema } from "./-loader";

export const Route = createFileRoute("/entreprise/$slug")({
  validateSearch: z.object({
    from: z
      .union([z.literal("entreprise"), z.literal("fondation")])
      .nullable()
      .default(null)
      .catch(null),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        from: null,
      }),
    ],
  },
  beforeLoad: ({ params, matches }) => {
    const { slug } = z.object({ slug: z.string() }).parse(params);

    const sirenOrSiretSlug = extractSirenOrSiretSlugFromUrl(slug);

    if (isLikelyASiret(sirenOrSiretSlug)) {
      throw redirect({
        to: "/etablissement/$slug",
        params: { slug: sirenOrSiretSlug },
      });
    }
    if (!isLikelyASiren(sirenOrSiretSlug)) {
      throw notFound();
    }

    const layoutMatch = matches.find(
      ({ routeId }) => routeId === "/entreprise/$slug"
    );
    const loaderData = z
      .object({ uniteLegale: z.object({ siren: z.string() }) })
      .safeParse(layoutMatch?.loaderData);

    return {
      shouldReloadUniteLegale:
        !loaderData.success ||
        loaderData.data.uniteLegale.siren !== sirenOrSiretSlug,
    };
  },
  shouldReload: ({ context }) => context.shouldReloadUniteLegale,
  loader: {
    staleReloadMode: "blocking",
    handler: async ({ params }) => {
      const { slug } = z.object({ slug: z.string() }).parse(params);

      const uniteLegale = await getUniteLegaleFromSlugFn({
        data: { slug, page: 1 },
      });

      return { uniteLegale };
    },
  },
  head: ({ match }) =>
    match.status === "error" || match.status === "notFound"
      ? meta.notFound()
      : {},
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <>
      <BannerManager />
      <Header useAgentBanner={true} useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">
        <HeaderDefaultError error={error} />
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  ),
  notFoundComponent: () => (
    <>
      <BannerManager />
      <Header useAgentBanner={true} useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">
        <NotFound withWrapper={false} />
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  ),
});

function RouteComponent() {
  const { uniteLegale } = Route.useLoaderData();

  return (
    <EntrepriseLayout uniteLegale={uniteLegale}>
      <Outlet />
    </EntrepriseLayout>
  );
}

function EntrepriseLayout({
  children,
  uniteLegale,
}: {
  children: ReactNode;
  uniteLegale: IUniteLegale;
}) {
  const { pathname } = useLocation();
  const { from } = Route.useSearch();

  const fiche = useMemo(() => {
    const result = entrepriseFicheSchema.safeParse(pathname.split("/")[3]);
    if (!result.success) {
      return "entreprise";
    }
    return result.data;
  }, [pathname]);

  const isFromFondation = isFondation(uniteLegale) && from === "fondation";

  return (
    <>
      {isFromFondation && <LeaveFondation />}
      <NPSBanner />
      <BannerManager />
      <Header
        searchPath={isFromFondation ? "/rechercher/fondations" : undefined}
        searchPlaceholder={
          isFromFondation ? "Chercher un fonds ou une fondation" : undefined
        }
        useAgentBanner={true}
        useAgentCTA={true}
        useSearchBar={true}
      />
      <main className="fr-container">
        <Title
          ficheType={ENTREPRISE_TAB_TO_FICHE[fiche]}
          uniteLegale={uniteLegale}
        />
        {children}
      </main>
      <SocialNetworks />
      <Question />
      <Footer />
      <BackToTop />
    </>
  );
}
