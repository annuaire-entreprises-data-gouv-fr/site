export interface IMarkdown {
  __typename: "Markdown";
}
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
