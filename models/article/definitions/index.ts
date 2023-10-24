import { loadAll } from '#utils/static-markdown-pages/load-all';
import { IArticle } from '../type';

export type IDefinition = {
  administrations: string[];
} & IArticle;

export const getDefinition = (slug: string) => {
  return allDefinitions.find((article) => article.slug === slug);
};

export const allDefinitions = loadAll<IDefinition>(
  // @ts-ignore
  require.context('data/definitions', false, /\.yml$/)
);
