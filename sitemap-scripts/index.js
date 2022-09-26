const { PageTreeBuilder } = require('./page-tree-builder');
const { downloadAndSaveData } = require('./download-data');
const { mem } = require('./memory');
const { readFileLineByLine } = require('./read-line');
const { getStaticPages } = require('./static-pages');
const { SitemapWriter } = require('./write-sitemap');
const { WEBSITE } = require('./constants');

const getEntrepriseUrl = (str) =>
  `${WEBSITE}/entreprise/${encodeURIComponent(str)}`;

async function main() {
  let maxMemory = 0;

  console.log('*** SEO script (sitemap and page tree) ***');

  console.time('⏱ Total time to execute script');

  const filePath = await downloadAndSaveData();

  let urlCount = 0;
  const sitemap = new SitemapWriter();
  const pageTree = new PageTreeBuilder();
  sitemap.createSitemapFolder();

  /**
   * Generate sitemap and populate dictByDep
   */
  try {
    await readFileLineByLine(filePath, (line) => {
      const [codePostal, naf, canonical] = line.split(',');
      const url = getEntrepriseUrl(canonical);
      sitemap.writeLine(url);

      pageTree.add(canonical, naf, codePostal);

      urlCount++;
      if (urlCount % 1000000 === 0) {
        maxMemory = Math.max(mem(), maxMemory);
      }
    });

    getStaticPages().map((page) => {
      sitemap.writeLine(WEBSITE + page);
    });

    // add department and naf page to the sitemap !!

    sitemap.closeLastSitemap();
  } finally {
    // await fs.promises.unlink(filePath);
  }
  console.log(`💾 Url count : ${urlCount}`);

  sitemap.createIndex();

  pageTree.build();

  console.log(`📈 Max memory usage ${Math.round(maxMemory * 100) / 100} mo`);
  console.timeEnd('⏱ Total time to execute script');
}

main();
