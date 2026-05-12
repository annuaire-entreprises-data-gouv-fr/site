import type { IArticle } from "#/models/article/type";

export function loadAll<T extends IArticle>(
  articlesFolderContext: Record<string, T>
): T[] {
  const articles = [] as T[];
  const keys = Object.keys(articlesFolderContext);
  const values = Object.values(articlesFolderContext);

  keys
    // weirdly context add duplicates - this filter removes them
    .filter((k: string) => k.indexOf("./") === 0)
    .forEach((key: string, index: number) => {
      const slug = key.replace(".yml", "").replace("./", "");
      articles.push({ ...values[index], slug });
    });

  return articles;
}
