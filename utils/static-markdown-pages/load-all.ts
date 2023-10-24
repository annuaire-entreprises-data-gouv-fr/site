import remarkHeadings from '@vcarl/remark-headings';
import rehypeStringify from 'rehype-stringify';
// @ts-ignore
import remarkHeadingId from 'remark-heading-id';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { IArticle } from '#models/article/type';

export function loadAll<T extends IArticle>(
  articlesFolderContext: Record<string, T>
): T[] {
  const rawArticles = [] as Array<T>;
  //@ts-ignore
  const keys = articlesFolderContext.keys();
  const values = keys.map(articlesFolderContext);

  keys
    // weirdly context add duplicates - this filter removes them
    .filter((k: string) => k.indexOf('./') === 0)
    .forEach((key: string, index: number) => {
      const slug = key.replace('.yml', '').replace('./', '');
      //@ts-ignore
      rawArticles.push({ ...values[index], slug });
    });

  return rawArticles.map((article) => ({
    ...article,
    body: parseBodyMarkdown(article.body as unknown as string),
  }));
}

function parseBodyMarkdown(body: string): {
  html: string;
  raw: string;
  headings: { id: string; value: string; depth: number }[];
} {
  const parsedBody = markdownProcessor.processSync(body);
  return {
    raw: body,
    html: parsedBody.value as string,
    // @ts-ignore
    headings: parsedBody.data.headings.map((header) => ({
      id: header.data.id,
      value: header.value,
      depth: header.depth,
    })),
  };
}

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkHeadingId, { defaults: true })
  .use(remarkHeadings)
  .use(remarkRehype)
  .use(rehypeStringify);
