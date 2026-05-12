import type { IArticle } from "#/models/article/type";

const slugFromModulePath = (path: string) => {
  const fileName = path.slice(Math.max(0, path.lastIndexOf("/") + 1));
  return fileName.replace(/\.json$/i, "");
};

export function loadAll<T extends IArticle>(modules: Record<string, T>): T[] {
  const articles = [] as T[];

  for (const [path, value] of Object.entries(modules)) {
    const slug = slugFromModulePath(path);
    articles.push({ ...value, slug });
  }

  return articles;
}
