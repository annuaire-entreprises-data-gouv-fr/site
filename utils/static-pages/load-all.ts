import { IArticle } from '#models/article/type';

export function loadAll<T extends IArticle>(
  articlesFolderContext: Record<string, T>
): T[] {
  const articles = [] as Array<T>;
  //@ts-ignore
  const keys = articlesFolderContext.keys();
  const values = keys.map(articlesFolderContext);

  keys
    // weirdly context add duplicates - this filter removes them
    .filter((k: string) => k.indexOf('./') === 0)
    .forEach((key: string, index: number) => {
      const slug = key.replace('.yml', '').replace('./', '');
      //@ts-ignore
      articles.push({ ...values[index], slug });
    });

  return articles;
}
