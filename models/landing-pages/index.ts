export interface ILandingPage {
  slug: string;
  title: string;
  footerLabel: string;
  published: boolean;
  description: string;
  filter: {
    name: string;
    value: string;
  };
  seo: {
    title: string;
    description: string;
  };
  reassurance: { title: string; body: string }[];
  datasources: string[];
  body: string;
}

const loadAllLandingPages = () => {
  const landingPages = [] as ILandingPage[];
  //@ts-ignore
  const landingPagesFolderContext = require.context(
    '/data/landing-pages',
    false,
    /\.yml$/
  );
  const keys = landingPagesFolderContext.keys();
  const values = keys.map(landingPagesFolderContext);

  keys
    // weirdly context add duplicates - this filter removes them
    .filter((k: string) => k.indexOf('./') === 0)
    .forEach((key: string, index: number) => {
      const slug = key.replace('.yml', '').replace('./', '');
      //@ts-ignore
      landingPages.push({ ...values[index], slug });
    });

  return landingPages.filter((page) => page.published || false);
};

export const getAllLandingPages = () => {
  return allLandingPages;
};

export const getLandingPage = (slug: string) => {
  return allLandingPages.find((landingPage) => landingPage.slug === slug);
};

const allLandingPages = loadAllLandingPages();
