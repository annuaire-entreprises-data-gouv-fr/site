import parseMarkdownSync, {
  IMarkdown,
} from '#components/markdown/parse-markdown';
/** @ts-ignore */
import data from '../../data/changelog.yml';

export type IChangelog = {
  date: string;
  body: IMarkdown;
  isProtected?: boolean;
  htmlBody?: string;
};

const loadData = (): IChangelog[] => {
  return (data as IChangelog[]).map((d) => {
    const htmlBody = parseMarkdownSync(d.body).html;
    return {
      ...d,
      htmlBody,
    };
  });
};

export const changelogData = loadData();
