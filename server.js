const { createServer } = require('http');
const DataDome = require('@datadome/node-module');
const { parse } = require('url');
const next = require('next');
const { loadEnvConfig } = require('@next/env');

// load env variables
loadEnvConfig(process.cwd());

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

const handleRequest = function (req, res) {
  // Be sure to pass `true` as the second argument to `url.parse`.
  // This tells it to parse the query portion of the URL.
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
};

const datadomeClient = new DataDome(
  process.env.DATADOME_SERVER_KEY,
  'api-eu-france-1.datadome.co'
)
  .on('blocked', function (req) {
    console.log('DataDome blocked this request');
  })
  .on('valid', function (req, res) {
    handleRequest(req, res);
  });

app.prepare().then(() => {
  createServer((req, res) => {
    if (process.env.DATADOME_SERVER_KEY) {
      datadomeClient.auth(req, res);
    } else {
      handleRequest(req, res);
    }
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
  });
});
