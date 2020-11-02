const fs = require('fs');
const readline = require('readline');

const mem = () => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `The script uses approximately ${Math.round(used * 100) / 100} MB`
  );
};

const saveSitemap = (indices, idx) => {
  const index = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  >
  ${indices
    .map(
      (url) => `
      <url>
      <loc>${url}</loc>
      </url>
      `
    )
    .join('')}
      </urlset>`;

  fs.writeFileSync(getSitemap(idx), index);
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

  fs.writeFileSync('./public/sitemap.xml', index);
};

const getUrl = (str) =>
  `${
    process.env.SITE_URL || 'https://annuaire-entreprises.data.gouv.fr'
  }${str}`;

const getSitemap = (idx) => `./public/maps/sitemap${idx}.xml`;

async function main() {
  let sitemapCount = 0;
  let currentBatch = [];

  const write = (elem) => {
    currentBatch.push(elem);

    if (currentBatch.length === 50000) {
      sitemapCount++;
      saveSitemap(currentBatch, sitemapCount);
      currentBatch = [];
    }
  };

  ['/', '/comment-ca-marche', '/faq'].map(write);

  const fileStream = fs.createReadStream('./sitemap/sitemap-name.csv');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    write(line);
  }

  const indices = [];
  for (i = 1; i <= sitemapCount; i++) {
    indices.push(getUrl(getSitemap(i)));
  }
  saveSitemapIndex(indices);
  console.log(`*** Saved ${sitemapCount} sitemaps ***`);
}

main();
