export type IArticle = {
  slug: string;
  administrations: string[];
  faqTargets: EFAQTargets[];
  title: string;
  seo: {
    description: string;
    title?: string;
  };
  body: string;
  cta: { label: string; to: string };
  more: { label: string; href: string }[];
};

export enum EFAQTargets {
  agent = 'Agent public',
  entreprise = 'Dirigeant(e) ou salarié(e) d’entreprise',
  independant = 'Indépendant(e)',
  association = 'Dirigeant(e) ou salarié(e) d’association',
  particulier = 'Particulier',
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

export const loadAllFaqArticlesByTarget = () => {
  const articlesByTargets: { [key: string]: IArticle[] } = {};

  const validTargets = Object.keys(EFAQTargets);

  allFaqArticles.forEach((article) => {
    article.faqTargets.forEach((target) => {
      if ([...validTargets, 'all', 'none'].indexOf(target) === -1) {
        throw new Error(`${target} is not a valid target`);
      }
      if (target.toString() === 'all') {
        validTargets.forEach((validTarget) => {
          articlesByTargets[validTarget] = [
            ...(articlesByTargets[validTarget] || []),
            article,
          ];
        });
      } else {
        articlesByTargets[target] = [
          ...(articlesByTargets[target] || []),
          article,
        ];
      }
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
