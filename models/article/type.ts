export type IArticle = {
  slug: string;
  title: string;
  seo: {
    description: string;
    title?: string;
  };
  body: {
    raw: string;
    html: string;
    headings: { id: string; value: string; depth: number }[];
  };
  cta: { label: string; to: string };
  more: { label: string; href: string }[];
};
