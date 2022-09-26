const { default: axios } = require('axios');
const fs = require('fs');

const SOURCE_URL =
  // 'https://object.files.data.gouv.fr/opendata/ae/sitemap-name-prod.csv';
  'https://object.files.data.gouv.fr/opendata/ae/sitemap-name-test.csv';

module.exports.downloadAndSaveData = async () => {
  // console.time('⏱ Download and save base SIREN');

  // const names = await axios.get(SOURCE_URL, { timeout: 120000 });
  // const data = names.data;
  // const filePath = `/tmp/sitemap-${new Date().getTime()}`;
  // await fs.promises.writeFile(filePath, data, 'utf-8');

  // console.timeEnd('⏱ Download and save base SIREN');

  // return filePath;
  return '/tmp/sitemap-1664197878691';
};
