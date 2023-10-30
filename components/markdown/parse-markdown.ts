import remarkHeadings from '@vcarl/remark-headings';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
// @ts-ignore
import remarkHeadingId from 'remark-heading-id';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

type IParsedMakdown = {
  raw: string;
  html: string;
  headings: { id: string; content: string; depth: number }[];
};

export default function parseMarkdownSync(body: string): IParsedMakdown {
  const parsedBody = markdownProcessor.processSync(body);
  return {
    raw: body,
    html: removeSingleParagraph(parsedBody.value as string),
    // @ts-ignore
    headings: parsedBody.data.headings.map((header) => ({
      id: header.data.id,
      content: header.value,
      depth: header.depth,
    })),
  };
}

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkHeadingId, { defaults: true })
  .use(remarkHeadings)
  .use(remarkRehype)
  .use(rehypeAutolinkHeadings, {
    content: {
      type: 'text',
      value: '#',
    },
    properties: {
      className: ['anchor-link'],
      'aria-hidden': true,
      'tab-index': -1,
    },
  })
  .use(rehypeStringify);

function removeSingleParagraph(body: string): string {
  return body.replace(/^<p>(.*)<\/p>$/, '$1');
}
