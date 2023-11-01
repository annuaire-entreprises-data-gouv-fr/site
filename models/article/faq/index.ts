import { loadAll } from '#utils/static-pages/load-all';
import { IArticle } from '../type';

export type IFaqArticle = {
  administrations: string[];
  faqTargets: EFAQTargets[];
} & IArticle;

export enum EFAQTargets {
  AGENT = 'agent',
  ENTREPRISE = 'entreprise',
  INDEPENDANT = 'independant',
  ASSOCIATION = 'association',
  PARTICULIER = 'particulier',
  ALL = 'all',
  NONE = 'none',
}

export const FAQTargets = {
  [EFAQTargets.AGENT]: 'Agent public',
  [EFAQTargets.ENTREPRISE]: 'Dirigeant(e) ou salarié(e) d’entreprise',
  [EFAQTargets.INDEPENDANT]: 'Indépendant(e)',
  [EFAQTargets.ASSOCIATION]: 'Dirigeant(e) ou salarié(e) d’association',
  [EFAQTargets.PARTICULIER]: 'Particulier',
};

export const loadAllFaqArticlesByTarget = () => {
  const articlesByTargets: { [key: string]: IFaqArticle[] } = {};

  allFaqArticles.forEach((article) => {
    article.faqTargets.forEach((target) => {
      if (Object.values(EFAQTargets).indexOf(target) === -1) {
        throw new Error(`${target} is not a valid target`);
      }

      if (target === EFAQTargets.ALL) {
        Object.keys(FAQTargets).forEach((validTarget) => {
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
    articlesByTargets[EFAQTargets.ALL] = [
      ...(articlesByTargets[EFAQTargets.ALL] || []),
      article,
    ];
  });

  return articlesByTargets;
};

export const getFaqArticle = (slug: string) => {
  return allFaqArticles.find((article) => article.slug === slug);
};

export const getFaqArticlesByTag = (tagList: string[]): IFaqArticle[] => {
  const filteredArticles = new Set<IFaqArticle>();
  allFaqArticles.forEach((article) => {
    tagList.forEach((tag) => {
      if (article.administrations.indexOf(tag) > -1) {
        filteredArticles.add(article);
      }
    });
  });

  return Array.from(filteredArticles);
};

export const allFaqArticles = loadAll<IFaqArticle>(
  // @ts-ignore
  require.context('data/faq', false, /\.yml$/)
);

export const allFaqArticlesByTarget = loadAllFaqArticlesByTarget();
