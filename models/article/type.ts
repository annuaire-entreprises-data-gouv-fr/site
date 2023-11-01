import { IMarkdown } from '#components/markdown/parse-markdown';

export type IArticle = {
  slug: string;
  title: string;
  seo: {
    description: string;
    title?: string;
  };
  body: IMarkdown;
  cta: { label: string; to: string };
  more: { label: string; href: string }[];
};
