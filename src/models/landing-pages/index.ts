export interface ILandingPage {
  body: string;
  datasources: string[];
  description: string;
  filter: {
    name: string;
    value: string;
  };
  footerLabel: string;
  isServicePublic: boolean;
  published: boolean;
  reassurance: { title: string; body: string }[];
  seo: {
    title: string;
    description: string;
  };
  slug: string;
  title: string;
}

type LandingPageJson = Omit<ILandingPage, "slug">;

const landingPageModules = import.meta.glob("../../data/landing-pages/*.json", {
  eager: true,
  import: "default",
}) as Record<string, LandingPageJson>;

const allLandingPages = [] as ILandingPage[];

for (const [path, parsed] of Object.entries(landingPageModules)) {
  const fileName = path.slice(Math.max(0, path.lastIndexOf("/") + 1));
  const slug = fileName.replace(/\.json$/i, "");
  allLandingPages.push({ ...parsed, slug });
}

const publishedLandingPages = allLandingPages.filter((page) => page.published);

export const getAllLandingPages = () => publishedLandingPages;

export const getLandingPage = (slug: string) =>
  publishedLandingPages.find((landingPage) => landingPage.slug === slug);
