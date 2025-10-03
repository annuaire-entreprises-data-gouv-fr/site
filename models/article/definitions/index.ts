import { loadAll } from "#utils/static-pages/load-all";
import type { IArticle } from "../type";

export type IDefinition = {
  administrations: string[];
} & IArticle;

export const getDefinition = (slug: string) =>
  allDefinitions.find((article) => article.slug === slug);

export const allDefinitions = loadAll<IDefinition>(
  // @ts-expect-error
  require.context("data/definitions", false, /\.yml$/)
);
