import fs from "node:fs";
import type {
  IAdministrationMetaData,
  IAPIMonitorMetaData,
} from "#/models/administrations/types";
import { slugify } from "#/utils/helpers/formatting/slugify";

const lpToPrerender = fs
  .readdirSync("src/data/landing-pages")
  .filter((file) => file.endsWith(".json"))
  .map((file) => fs.readFileSync(`src/data/landing-pages/${file}`, "utf-8"))
  .map((file) => JSON.parse(file))
  .filter((page) => page.published)
  .map((page) => `/lp/${page.slug}`);

const allAdministrations = fs
  .readdirSync("src/data/administrations")
  .filter((file) => file.endsWith(".json"))
  .map((file) => fs.readFileSync(`src/data/administrations/${file}`, "utf-8"))
  .map((file) => JSON.parse(file)) as IAdministrationMetaData[];

const allApi = allAdministrations.reduce<Record<string, IAPIMonitorMetaData>>(
  (acc, administration) => {
    (administration.apiMonitors || []).forEach((monitor) => {
      acc[monitor.apiSlug] = monitor;
    });
    return acc;
  },
  {}
);

const allFaqArticles = fs
  .readdirSync("src/data/faq")
  .filter((file) => file.endsWith(".json"))
  .map((file) => file.replace(".json", ""))
  .map((slug) => `/faq/${slug}`);

const allDefinitions = fs
  .readdirSync("src/data/definitions")
  .filter((file) => file.endsWith(".json"))
  .map((file) => file.replace(".json", ""))
  .map((slug) => `/definitions/${slug}`);

const definitionsToPrerender = allDefinitions;

const administrationsToPrerender = allAdministrations.map(
  (admin) => `/administration/${admin.slug}`
);

const faqToPrerender = allFaqArticles;

const faqModifierToPrerender = allAdministrations
  .flatMap(({ dataSources }) =>
    (dataSources || []).flatMap((datasource) =>
      (datasource.data || []).map(({ label }) => {
        const slug = slugify(label);
        return {
          slug,
          apiSlug: datasource.apiSlug,
        };
      })
    )
  )
  .filter((d) => {
    const api = allApi[d.apiSlug];
    return !api?.isProtected;
  })
  .map((d) => `/faq/modifier/${d.slug}`);

const normalizePrerenderPath = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

export const prerenderedPages = [
  "/",
  "/lp/agent-public",
  ...lpToPrerender,
  ...administrationsToPrerender,
  "faq",
  ...faqToPrerender,
  "/faq/modifier",
  ...faqModifierToPrerender,
  "/definitions",
  ...definitionsToPrerender,
  "connexion/au-revoir",
  "connexion/echec-connexion",
  "connexion/habilitation/administration-inconnue",
  "connexion/habilitation/prestataires",
  "/accessibilite",
  "/a-propos/equipe",
  "/a-propos/budget",
  "/a-propos/comment-ca-marche",
  "/a-propos/donnees-extrait-kbis",
  "/partager",
  "/mentions-legales",
  "/modalites-utilisation",
  "/vie-privee",
  "/historique-des-modifications",
  "/robots.txt",
].map(normalizePrerenderPath);
