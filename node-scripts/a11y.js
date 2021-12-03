const { exec } = require('child_process');

// subset of pages to test
const PAGES = [
  '/',
  '/donnees-extrait-kbis',
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
  '/etablissement/88087814500015',
  '/rechercher?terme=ganymede',
];

console.info('=== A11y checker ===');

PAGES.forEach((page) => {
  exec(
    './node_modules/@axe-core/cli/dist/src/bin/cli.js ' +
      'http://localhost:3000' +
      page +
      ' --stdout --exit --disable scrollable-region-focusable --disable region --show-errors',
    (err, stdout, stderr) => {
      if (err || stderr) {
        console.log(err, stderr);
        process.exit(1);
      }
      if (stdout.indexOf('0 violations found!') > -1) {
        console.info('=> ✅ ' + page);
      } else {
        console.info('=> 😭 ' + page);
        console.log(stdout);
        process.exit(1);
      }
    }
  );
});
