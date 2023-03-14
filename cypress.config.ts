import { defineConfig } from 'cypress';
import cypressSplit from 'cypress-split';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      cypressSplit(on, config);
      // implement node event listeners here
      return config;
    },
  },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0',
});
