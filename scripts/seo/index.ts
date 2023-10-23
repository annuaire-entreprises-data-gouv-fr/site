import { WEBSITE } from './constants';
import {
  cleanDistFolder,
  deleteDataFile,
  downloadAndSaveData,
} from './download-data';
import { mem } from './memory';
import { PageTreeBuilder } from './page-tree-builder';
import { readFileLineByLine } from './read-line';
import { getStaticPages } from './static-pages';
import { SitemapWriter } from './write-sitemap';

const getEntrepriseUrl = (str: string) =>
  `${WEBSITE}/entreprise/${encodeURIComponent(str)}`;

async function main() {
  let maxMemory = 0;

  console.info('*** SEO script (sitemap and page tree) ***');
  console.time('⏱ Total time to execute script');

  const filePath = await downloadAndSaveData();

  cleanDistFolder();
  let urlCount = 0;
  const sitemap = new SitemapWriter();
  const pageTree = new PageTreeBuilder();

  /**
   * Generate sitemap and populate pageTree database
   */
  try {
    await readFileLineByLine(filePath, (line: string) => {
      const [codePostal, naf, canonical] = line.split(',');
      const url = getEntrepriseUrl(canonical);
      sitemap.writeLine(url);

      pageTree.add(canonical, naf, codePostal);

      urlCount++;
      if (urlCount % 1000000 === 0) {
        maxMemory = Math.max(mem(), maxMemory);
      }
    });

    [...getStaticPages(), ...pageTree.getUrlsForSitemap()].map((page) => {
      sitemap.writeLine(WEBSITE + page);
    });

    sitemap.endLastSitemap();
  } finally {
    await deleteDataFile(filePath);
  }
  console.info(`💾 Url total : ${urlCount}`);

  // generate sitemap Index
  sitemap.createIndex();

  // generate PageTree
  pageTree.checkIgnoredUrlCount();
  pageTree.build();

  console.info(`📈 Max memory usage ${Math.round(maxMemory * 100) / 100} mo`);
  console.timeEnd('⏱ Total time to execute script');
}

main();

export default {};
