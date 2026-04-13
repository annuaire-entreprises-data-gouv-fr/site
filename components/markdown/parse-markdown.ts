import remarkHeadings from "@vcarl/remark-headings";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import remarkHeadingId from "remark-heading-id";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Compatible } from "unified/lib";

export interface IMarkdown {
  __typename: "Markdown";
}

interface IParsedMakdown {
  headings: { id: string; content: string; depth: number }[];
  html: string;
  raw: IMarkdown;
}

export default function parseMarkdownSync(
  body: IMarkdown | string
): IParsedMakdown {
  const parsedBody = markdownProcessor.processSync(body as Compatible);
  return {
    raw: body as IMarkdown,
    html: removeSingleParagraph(parsedBody.value as string),
    // @ts-expect-error
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
      type: "text",
      value: "#",
    },
    properties: {
      className: ["anchor-link"],
      "aria-hidden": true,
      "tab-index": -1,
    },
  })
  .use(rehypeStringify);

function removeSingleParagraph(body: string): string {
  return body.replace(/^<p>(.*)<\/p>$/, "$1");
}
