const fs = require('fs');
const fetch = require('node-fetch');

const mem = () => {
  return (used = process.memoryUsage().heapUsed / 1024 / 1024);
};

const logMem = () => {
  const used = mem();
  console.log(
    `The script uses approximately ${Math.round(used * 100) / 100} MB`
  );
};

const path = process.env.NODE_ENV === 'production' ? '/tmp/build' : '.';

const WEBSITE =
  process.env.SITE_URL || 'https://annuaire-entreprises.data.gouv.fr';

const getIndexUrl = (str) => `${WEBSITE}${str}`;

const getEntrepriseUrl = (str) =>
  `${WEBSITE}/entreprise/${encodeURIComponent(str)}`;

const getSitemap = (idx) => `/sitemap${idx}.xml`;

const saveSitemap = (indices, idx) => {
  const index = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  >
  ${indices
    .map(
      (url) => `
      <url>
      <loc>${getEntrepriseUrl(url)}</loc>
      </url>
      `
    )
    .join('')}
      </urlset>`;

  fs.writeFileSync(`${path}/public${getSitemap(idx)}`, index);
};

const saveSitemapIndex = (indices) => {
  const index = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${indices
    .map(
      (url) => `
      <sitemap>
      <loc>${url}</loc>
      </sitemap>
      `
    )
    .join('')}
      </sitemapindex>`;

  fs.writeFileSync(`${path}/public/sitemap.xml`, index);
};

async function main() {
  let sitemapCount = 0;
  let currentBatch = [];
  let urlCount = 0;
  let maxMemory = 0;

  console.log('*** Sitemap generation script ***');

  console.time('⏱ Total time to execute script');

  const write = (elem) => {
    currentBatch.push(elem);
    urlCount++;

    if (currentBatch.length === 50000) {
      sitemapCount++;
      saveSitemap(currentBatch, sitemapCount);
      currentBatch = [];
    }
  };

  ['/', '/comment-ca-marche', 'rechercher', '/faq'].map(write);

  console.time('⏱ Time to download base SIREN');
  const url =
    'https://files.data.gouv.fr/annuaire-entreprises/sitemap-name.csv';
  const names = await fetch(url);
  const data = await names.text();
  console.timeEnd('⏱ Time to download base SIREN');

  data.split('\n').forEach((line, idx) => {
    if (idx % 10000 === 0) {
      maxMemory = Math.max(mem(), maxMemory);
    }
    write(line);
  });

  const indices = [];
  for (i = 1; i <= sitemapCount; i++) {
    indices.push(getIndexUrl(getSitemap(i)));
  }
  saveSitemapIndex(indices);

  console.timeEnd('⏱ Total time to execute script');
  console.log(`📈 Max memory usage ${Math.round(maxMemory * 100) / 100} mo`);
  console.log(`💾 Saved ${sitemapCount} sitemaps with ${urlCount} urls`);
}

main();
