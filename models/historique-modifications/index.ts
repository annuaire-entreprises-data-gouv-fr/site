import parseMarkdownSync, {
  type IMarkdown,
} from "#components/markdown/parse-markdown";
/** @ts-expect-error */
import data from "../../data/changelog.yml";

interface IChangelogTarget {
  agent: boolean;
  api: boolean;
  site: boolean;
}

interface IChangelogRaw {
  body: IMarkdown;
  date: string;
  target?: IChangelogTarget;
}

export interface IChangelog {
  date: string;
  htmlBody: string;
  target: IChangelogTarget;
}

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
  const agent = changelogData.find(
    ({ target }) => target.agent || target.site
  )?.date;
  const site = changelogData.find(({ target }) => target.site)?.date;
  return {
    agent,
    site,
  };
};

export const lastDates = loadLastDates();
