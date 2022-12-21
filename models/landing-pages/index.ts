export interface ILandingPage {
  slug: string;
  title: string;
  description: string;
  filter: {
    name: string;
    value: string;
  };
  seo: {
    title: string;
    description: string;
  };
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
      landingPages.push({ ...values[index], slug });
    });

  return landingPages;
};

export const getAllLandingPages = () => {
  return allLandingPages;
};

export const getLandingPage = (slug: string) => {
  return allLandingPages.find((landingPage) => landingPage.slug === slug);
};

const allLandingPages = loadAllLandingPages();
