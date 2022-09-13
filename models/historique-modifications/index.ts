/** @ts-ignore */
import data from '../../data/changelog.yml';

export interface IChangelog {
  date: string;
  title: string;
  description?: string;
}

export default data as { changelog: IChangelog[] };
