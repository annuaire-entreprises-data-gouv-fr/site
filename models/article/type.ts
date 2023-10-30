export type IArticle = {
  slug: string;
  title: string;
  seo: {
    description: string;
    title?: string;
  };
  body: string;
  cta: { label: string; to: string };
  more: { label: string; href: string }[];
};
