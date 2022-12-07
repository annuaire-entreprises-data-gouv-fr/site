import fs from 'fs';
import { URL_PER_SITEMAP, WEBSITE } from './constants';

/**
 * XML Helpers
 */

const SITEMAP_START = `<?xml version="1.0" encoding="UTF-8"?>
 <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const SITEMAP_END = '</urlset>';

const formatUrl = (url: string) => `<url>
      <loc>${url}</loc>
      </url>`;

class SitemapWriter {
  private writeStream: fs.WriteStream | null;
  private urlCount: number;
  private sitemapCount: number;

  constructor() {
    this.writeStream = null;
    this.sitemapCount = 1;
    this.urlCount = 0;
  }

  write = (str: string) => {
    if (!this.writeStream) {
      throw new Error('Should never happen');
    }

    this.writeStream.write(str);
  };

  writeLine = (url: string) => {
    if (this.urlCount === 0) {
      const newSitemapFilePath = `./dist/sitemap_${this.sitemapCount}.xml`;
      this.writeStream = fs.createWriteStream(newSitemapFilePath);
      this.write(SITEMAP_START);
    }

    this.write(formatUrl(url));
    this.urlCount++;

    if (this.urlCount >= URL_PER_SITEMAP) {
      this.urlCount = 0;
      this.sitemapCount++;
      this.write(SITEMAP_END);
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

    fs.writeFileSync('./dist/sitemap.xml', index);

    console.info(`💾 Sitemap count : ${this.sitemapCount}`);
  };

  endLastSitemap() {
    if (this.urlCount !== 0) {
      // last sitemap needs to be ended
      this.write(SITEMAP_END);
    }
  }
}

export { SitemapWriter };
