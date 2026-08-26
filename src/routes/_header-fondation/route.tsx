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
import { Link } from "#/components/link";
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
import styles from "./style.module.css";

const loadFondationPage = createServerFn({ method: "POST" })
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

export const Route = createFileRoute("/_header-fondation")({
  validateSearch: z.object({
    page: z.number().min(1).optional().default(1).catch(1),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        page: 1,
      }),
    ],
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
  }),
  shouldReload: true,
  loader: {
    staleReloadMode: "blocking",
    handler: async ({ params, deps }) => {
      const { slug } = z.object({ slug: z.string() }).parse(params);

      return await loadFondationPage({
        data: {
          slug,
          page: deps.page,
        },
      });
    },
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
  notFoundComponent: () => <NotFound withWrapper={false} />,
});

function RouteComponent() {
  const { uniteLegale } = Route.useLoaderData();

  return (
    <>
      {!uniteLegale && (
        <div className={styles.leaveFondations}>
          <div className="fr-container">
            <Link to="/">
              ← Quitter les Fondations et revenir sur l'Annuaire des Entreprises
            </Link>
          </div>
        </div>
      )}
      <NPSBanner />
      <BannerManager />
      <Header
        searchPath={uniteLegale ? undefined : "/rechercher/fondations"}
        searchPlaceholder={
          uniteLegale ? undefined : "Chercher un fonds ou une fondation"
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
