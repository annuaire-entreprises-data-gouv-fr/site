import Summary from "#/components-ui/summary";
import parseMarkdownSync, { type IMarkdown } from "./parse-markdown";

export default function RenderMarkdown({
  children,
  showToc = false,
}: {
  showToc?: boolean;
  children: IMarkdown | string;
}) {
  const { html, headings } = parseMarkdownSync(children);

  return (
    <>
      {showToc && (
        <Summary headings={headings.filter(({ depth }) => depth === 2)} />
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
