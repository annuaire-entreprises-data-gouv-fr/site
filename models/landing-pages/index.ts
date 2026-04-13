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

const loadAllLandingPages = () => {
  const landingPages = [] as ILandingPage[];
  const landingPagesFolderContext = require.context(
    "/data/landing-pages",
    false,
    /\.yml$/
  );
  const keys = landingPagesFolderContext.keys();
  const values = keys.map(landingPagesFolderContext);

  keys
    // weirdly context add duplicates - this filter removes them
    .filter((k: string) => k.indexOf("./") === 0)
    .forEach((key: string, index: number) => {
      const slug = key.replace(".yml", "").replace("./", "");
      //@ts-expect-error
      landingPages.push({ ...values[index], slug });
    });

  return landingPages.filter((page) => page.published || false);
};

export const getAllLandingPages = () => allLandingPages;

export const getLandingPage = (slug: string) =>
  allLandingPages.find((landingPage) => landingPage.slug === slug);

const allLandingPages = loadAllLandingPages();
