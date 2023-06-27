export type IArticle = {
  slug: string;
  administrations: string[];
  targets: string[];
  title: string;
  seo: {
    description: string;
    title?: string;
  };
  body: string;
  cta: { label: string; to: string };
  more: { label: string; href: string }[];
};

export const faqTargets = {
  agent: 'Agent public',
  dirigeant: 'Dirigeant(e) d’entreprise ou d’association',
  independant: 'Indépendant(e)',
  salarie: 'Salarié(e) d’entreprise ou d’association',
  particulier: 'Particulier',
  tous: 'Autre',
};

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

export const loadAllFaqArticlesByTarget = () => {
  const articlesByTargets: { [key: string]: IArticle[] } = {};

  allFaqArticles.forEach((article) => {
    const targets = [...(article.targets || []), 'tous'];
    targets.forEach((target) => {
      if (Object.keys(faqTargets).indexOf(target) === -1) {
        throw new Error(`${target} is not a valid target`);
      }
      articlesByTargets[target] = [
        ...(articlesByTargets[target] || []),
        article,
      ];
    });
  });

  return articlesByTargets;
};

export const getFaqArticle = (slug: string) => {
  return allFaqArticles.find((article) => article.slug === slug);
};

export const getFaqArticlesByTag = (tagList: string[]): IArticle[] => {
  const filteredArticles = new Set<IArticle>();
  allFaqArticles.forEach((article) => {
    tagList.forEach((tag) => {
      if (article.administrations.indexOf(tag) > -1) {
        filteredArticles.add(article);
      }
    });
  });

  return Array.from(filteredArticles);
};

export const allFaqArticles = loadAllArticles();

export const allFaqArticlesByTarget = loadAllFaqArticlesByTarget();
