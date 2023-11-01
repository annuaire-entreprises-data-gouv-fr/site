import { IMarkdown } from '#components/markdown/parse-markdown';
/** @ts-ignore */
import data from '../../data/changelog.yml';

export type IChangelog = {
  date: string;
  title: IMarkdown;
  description?: IMarkdown;
};

export default data as { changelog: IChangelog[] };
