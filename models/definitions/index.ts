export type IDefinition = {
  slug: string;
  administrations: string[];
  title: string;
  seo: {
    description: string;
    title?: string;
  };
  body: string;
  cta: { label: string; to: string };
  more: { label: string; href: string }[];
};

const loadAllDefinitions = () => {
  const definitions = [] as IDefinition[];
  //@ts-ignore
  const definitionsFolderContext = require.context(
    '/data/definitions',
    false,
    /\.yml$/
  );
  const keys = definitionsFolderContext.keys();
  const values = keys.map(definitionsFolderContext);

  keys
    // weirdly context add duplicates - this filter removes them
    .filter((k: string) => k.startsWith('./'))
    .forEach((key: string, index: number) => {
      const slug = key.replace('.yml', '').replace('./', '');
      definitions.push({ ...values[index], slug });
    });

  return definitions;
};

export const getDefinition = (slug: string) => {
  return allDefinitions.find((article) => article.slug === slug);
};

export const allDefinitions = loadAllDefinitions();
