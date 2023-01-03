export interface IArticle {
  slug: string;
  administrations: string[];
  target: string[];
  title: string;
  body: string;
  cta: { label: string; to: string };
  more: { label: string; href: string }[];
}

const loadAllArticles = () => {
  const articles = [] as IArticle[];
  //@ts-ignore
  const faqArticlesFolderContext = require.context(
    '/data/faq',
    false,
    /\.yml$/
  );
  const keys = faqArticlesFolderContext.keys();
  const values = keys.map(faqArticlesFolderContext);

  keys
    // weirdly context add duplicates - this filter removes them
    .filter((k: string) => k.indexOf('./') === 0)
    .forEach((key: string, index: number) => {
      const slug = key.replace('.yml', '').replace('./', '');
      //@ts-ignore
      articles.push({ ...values[index], slug });
    });

  return articles;
};

export const getAllFaqArticles = () => {
  return allArticles;
};

export const getFaqArticle = (slug: string) => {
  return allArticles.find((article) => article.slug === slug);
};

export const getFaqArticlesByTag = (tagList: string[]): IArticle[] => {
  const filteredArticles = new Set<IArticle>();
  allArticles.forEach((article) => {
    tagList.forEach((tag) => {
      if (article.administrations.indexOf(tag) > -1) {
        filteredArticles.add(article);
      }
    });
  });

  return Array.from(filteredArticles);
};

const allArticles = loadAllArticles();
