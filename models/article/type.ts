export type IArticle = {
  slug: string;
  title: string;
  seo: {
    description: string;
    title?: string;
  };
  body: IParsedMakdown;
  cta: { label: string; to: string };
  more: { label: string; href: string }[];
};

export type IParsedMakdown = {
  raw: string;
  html: string;
  headings: { id: string; content: string; depth: number }[];
};
