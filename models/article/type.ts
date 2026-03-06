import type { IMarkdown } from "#components/markdown/parse-markdown";

export interface IArticle {
  body: IMarkdown;
  cta: { label: string; to: string };
  group: string;
  more: { label: string; href: string }[];
  seo: {
    description: string;
    title?: string;
  };
  slug: string;
  title: string;
}
