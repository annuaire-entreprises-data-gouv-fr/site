import Summary from '#components-ui/summary';
import parseMarkdownSync, { IMarkdown } from './parse-markdown';

export default function RenderMarkdownServerOnly({
  children,
  showToc = false,
}: {
  showToc?: boolean;
  children: IMarkdown | string;
}) {
  if (typeof window !== 'undefined') {
    throw new Error('This component is server-side only');
  }
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
