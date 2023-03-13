import http from 'http';
import { defineConfig } from 'cypress';
import cypressSplit from 'cypress-split';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import next from 'next';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    async setupNodeEvents(on, config) {
      // implement node event listeners here
      cypressSplit(on, config);

      const app = next({ dev: true });
      const handleNextRequests = app.getRequestHandler();
      await app.prepare();

      const customServer = new http.Server(async (req, res) => {
        return handleNextRequests(req, res);
      });

      await new Promise((resolve, reject) => {
        customServer.listen(3000, () => {
          // eslint-disable-next-line no-console
          console.log('> Ready on http://localhost:3000');
          resolve(null);
        });
      });
      const mswServer = setupServer();
      on('task', {
        'msw:listen': () => {
          mswServer.listen({ onUnhandledRequest: 'warn' });
          // eslint-disable-next-line no-console
          console.log('> MSW server is listening');
          return null;
        },
        'msw:clean': () => {
          mswServer.resetHandlers();
          // eslint-disable-next-line no-console
          console.log('> MSW is cleaned');
          return null;
        },
        'msw:reset:handlers': () => {
          mswServer.resetHandlers();
          return null;
        },
        'msw:set:handlers': (
          queries: {
            type: 'get' | 'post';
            url: string;
            payload: Record<string, any>;
            persist: boolean;
          }[]
        ) => {
          const handlers = queries.map(
            ({ url, payload, persist = false, type = 'get' }) =>
              rest[type](url, (req, res, ctx) => {
                if (persist) {
                  return res(ctx.json(payload));
                }
                return res.once(ctx.json(payload));
              })
          );
          mswServer.use(...handlers);
          return null;
        },
      });
      return config;
    },
  },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0',
});
