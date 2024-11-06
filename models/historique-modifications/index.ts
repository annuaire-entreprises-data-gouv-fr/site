import parseMarkdownSync, {
  IMarkdown,
} from '#components/markdown/parse-markdown';
/** @ts-ignore */
import data from '../../data/changelog.yml';

type IChangelogTarget = {
  agent: boolean;
  site: boolean;
  api: boolean;
};

type IChangelogRaw = {
  date: string;
  body: IMarkdown;
  target?: IChangelogTarget;
};

export type IChangelog = {
  date: string;
  target: IChangelogTarget;
  htmlBody: string;
};

const loadData = (): IChangelog[] => {
  const noneTarget = {
    agent: false,
    api: false,
    site: false,
  };

  return (data as IChangelogRaw[]).map((d) => {
    const htmlBody = parseMarkdownSync(d.body).html;
    return {
      ...d,
      htmlBody,
      target: { ...noneTarget, ...(d.target ? d.target : { site: true }) },
    };
  });
};

export const changelogData = loadData();

const loadLastDates = () => {
  const agent = changelogData.find(({ target }) => target.agent)?.date;
  const site = changelogData.find(({ target }) => target.site)?.date;
  return {
    agent,
    site,
  };
};

export const lastDates = loadLastDates();
