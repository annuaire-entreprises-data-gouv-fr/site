import { loadAll } from "#/utils/static-pages/load-all";
import type { IArticle } from "../type";

export type IFaqArticle = {
  administrations: string[];
} & IArticle;

const faqModules = import.meta.glob("../../../data/faq/*.json", {
  eager: true,
  import: "default",
}) as Record<string, IFaqArticle>;

export const loadAllFaqArticlesByGroup = () => {
  const articlesByGroup: { [key: string]: IFaqArticle[] } = {};

  allFaqArticles.forEach((article) => {
    articlesByGroup[article.group || "default"] = [
      ...(articlesByGroup[article.group || "default"] || []),
      article,
    ];
  });

  return articlesByGroup;
};

export const getFaqArticle = (slug: string) =>
  allFaqArticles.find((article) => article.slug === slug);

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

export const allFaqArticles = loadAll<IFaqArticle>(faqModules);

export const allFaqArticlesByGroup = loadAllFaqArticlesByGroup();
