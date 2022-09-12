const { default: axios } = require('axios');
const fs = require('fs');

/** This script generate the full sitemap
 *
 * 1. download most recent list of 20m siren from datagouv server
 * 2. produce as many sitemap as necessary (sitemap can contains 50k url max)
 * 3. create a sitemap index
 *
 * NB : this script is supposed to run on server, on deploy. Therefore it is triggered in the default build command that will be used by dokku
 * NB 2 : main risk here is to overflow memory, always monitor max mem usage when running the script
 */

/**
 * XML Helpers
 */

const SITEMAP_START = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const SITEMAP_END = '</urlset>';

const formatUrl = (url) => `<url>
     <loc>${url}</loc>
     </url>`;

const saveSitemapIndex = (indices) => {
  const index = `<?xml version="1.0" encoding="UTF-8"?>
 <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 ${indices
   .map(
     (url) => `<sitemap>
                <loc>${url}</loc>
                </sitemap>`
   )
   .join('')}
     </sitemapindex>`;

  fs.writeFileSync('./public/sitemap/sitemap.xml', index);
};

/**
 * Memory monitoring helpers
 */

const mem = () => {
  return (used = process.memoryUsage().heapUsed / 1024 / 1024);
};

const logMem = () => {
  const used = mem();
  console.log(
    `The script uses approximately ${Math.round(used * 100) / 100} MB`
  );
};

/**
 * Script itself
 */

const WEBSITE =
  process.env.SITE_URL || 'https://annuaire-entreprises.data.gouv.fr';

const getIndexUrl = (str) => `${WEBSITE}${str}`;

const getEntrepriseUrl = (str) =>
  `${WEBSITE}/entreprise/${encodeURIComponent(str)}`;

async function main() {
  let writeStream = null;
  let sitemapCount = 1;
  let urlCount = 0;
  let totalUrlCount = 0;
  let maxMemory = 0;

  const writeLine = (line) => {
    if (urlCount === 10000) {
      maxMemory = Math.max(mem(), maxMemory);
    }
    if (urlCount === 0) {
      const newSitemapFilePath = `./public/sitemap/sitemap${sitemapCount}.xml`;
      writeStream = fs.createWriteStream(newSitemapFilePath);
      writeStream.write(SITEMAP_START);
    }

    writeStream.write(line);
    urlCount++;
    totalUrlCount++;

    if (urlCount === 50000) {
      urlCount = 0;
      sitemapCount++;
      writeStream.write(SITEMAP_END);
    }
  };

  console.log('*** Sitemap generation script ***');

  console.time('⏱ Total time to execute script');

  console.time('⏱ Time to download base SIREN');
  const url =
    'https://object.files.data.gouv.fr/opendata/ae/sitemap-name-prod.csv';
  const names = await axios.get(url, { timeout: 120000 });
  const data = names.data;
  console.timeEnd('⏱ Time to download base SIREN');
  const filePath = `/tmp/sitemap-${new Date().getTime()}`;

  try {
    await fs.promises.writeFile(filePath, data, 'utf-8');

    const readStream = fs.createReadStream(filePath);

    const sitemapDir = './public/sitemap/';
    if (!fs.existsSync(sitemapDir)) {
      console.time('📂 Creating new /sitemap folder');
      fs.mkdirSync(sitemapDir);
    }

    await new Promise((resolve, reject) => {
      readStream.on('error', (err) => reject(err));
      readStream.on('data', (chunk) => {
        const line = chunk.toString('utf-8');
        line.split('\n').map((line) => {
          const url = formatUrl(getEntrepriseUrl(line));
          writeLine(url);
        });
      });
      readStream.on('end', () => resolve());
    });

    [
      '/',
      '/donnees-extrait-kbis',
      '/comment-ca-marche',
      '/rechercher',
      '/faq',
    ].map((path) => {
      writeLine(formatUrl(WEBSITE + path));
    });

    if (urlCount !== 0) {
      // last sitemap needs to be ended
      writeLine(SITEMAP_END);
    }
  } finally {
    await fs.promises.unlink(filePath);
  }

  const indices = [];
  for (i = 1; i <= sitemapCount; i++) {
    indices.push(getIndexUrl(`/sitemap${i}.xml`));
  }
  saveSitemapIndex(indices);

  console.timeEnd('⏱ Total time to execute script');
  console.log(`📈 Max memory usage ${Math.round(maxMemory * 100) / 100} mo`);
  console.log(`💾 Saved ${sitemapCount} sitemaps with ${totalUrlCount} urls`);
}

main();
