const fs = require('fs');
const { URL_PER_SITEMAP, WEBSITE } = require('./constants');

/**
 * XML Helpers
 */

const SITEMAP_START = `<?xml version="1.0" encoding="UTF-8"?>
 <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const SITEMAP_END = '</urlset>';

const formatUrl = (url) => `<url>
      <loc>${url}</loc>
      </url>`;

class SitemapWriter {
  constructor() {
    this.writeStream = null;
    this.sitemapCount = 1;
    this.urlCount = 0;
  }

  writeLine = (url) => {
    if (this.urlCount === 0) {
      const newSitemapFilePath = `./public/sitemap/sitemap_${this.sitemapCount}.xml`;
      this.writeStream = fs.createWriteStream(newSitemapFilePath);
      this.writeStream.write(SITEMAP_START);
    }

    this.writeStream.write(formatUrl(url));
    this.urlCount++;

    if (this.urlCount >= URL_PER_SITEMAP) {
      this.urlCount = 0;
      this.sitemapCount++;
      this.writeStream.write(SITEMAP_END);
    }
  };

  createIndex = () => {
    const indices = [];

    for (let i = 1; i <= this.sitemapCount; i++) {
      indices.push(`${WEBSITE}/sitemap_${i}.xml`);
    }

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

    console.log(`💾 Sitemap count : ${this.sitemapCount}`);
  };

  closeLastSitemap() {
    if (this.urlCount !== 0) {
      // last sitemap needs to be ended
      this.writeLine(SITEMAP_END);
    }
  }

  createSitemapFolder = () => {
    const sitemapDir = './public/sitemap/';
    if (!fs.existsSync(sitemapDir)) {
      console.log('📂 Creating new /sitemap folder');
      fs.mkdirSync(sitemapDir);
    }
  };
}

module.exports = { SitemapWriter };
