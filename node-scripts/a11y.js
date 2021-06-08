const { exec } = require('child_process');
const fs = require('fs');

const start = new Date();

// subset of pages to test
const PAGES = [
  '/',
  'donnees-extrait-kbis',
  '/comment-ca-marche',
  '/rechercher',
  '/faq',
  '/accessiblite',
  '/vie-privee',
  '/entreprise/880878145',
  '/justificatif/880878145',
  '/annonces/880878145',
  '/administration/insee',
  '/administration/',
  '/carte',
  '/carte/88087814500015',
  '/etablissement/88087814500015',
  '/rechercher?terme=ganymede',
];

console.info('=== A11y checker ===');

PAGES.forEach((page) => {
  exec(
    './node_modules/@axe-core/cli/dist/src/bin/cli.js ' +
      'http://localhost:3000' +
      page,
    ' --stdout --exit --disable scrollable-region-focusable --disable region',
    (err, stdout, stderr) => {
      console.info('===> 🔍 ' + page);
      console.log(stdout);
    }
  );
});
