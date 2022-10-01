import * as axios from 'axios';
import fs from 'fs';

const SOURCE_URL =
  'https://object.files.data.gouv.fr/opendata/ae/sitemap-name-prod.csv';

export const downloadAndSaveData = async () => {
  console.time('⏱ Download and save base SIREN');

  //@ts-ignore
  const names = await axios.get(SOURCE_URL, { timeout: 120000 });
  const data = names.data;
  const filePath = `/tmp/sitemap-${new Date().getTime()}`;
  await fs.promises.writeFile(filePath, data, 'utf-8');

  console.timeEnd('⏱ Download and save base SIREN');

  return filePath;
};

export const deleteDataFile = async (filePath: string) => {
  await fs.promises.unlink(filePath);
};
