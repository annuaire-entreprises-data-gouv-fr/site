import { loadAll } from "#/utils/static-pages/load-all";
import type { IArticle } from "../type";

export type IDefinition = {
  administrations: string[];
} & IArticle;

const definitionModules = import.meta.glob("../../data/definitions/*.json", {
  eager: true,
  import: "default",
}) as Record<string, IDefinition>;

export const getDefinition = (slug: string) =>
  allDefinitions.find((article) => article.slug === slug);

export const allDefinitions = loadAll<IDefinition>(definitionModules);
