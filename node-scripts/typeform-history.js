const fs = require('fs');
const MatomoTracker = require('matomo-tracker');

const data = fs.readFileSync('./typeform.tsv', {
  encoding: 'utf8',
  flag: 'r',
});

const responses = data.split('\r\n');

const events = [];

const matomo = new MatomoTracker(
  // process.env.MATOMO_SITE_ID,
  145,
  'https://stats.data.gouv.fr/piwik.php'
);

responses
  .slice(1)
  // .slice(0, 10)
  .forEach((line) => {
    const cells = line.split('	');
    const s = {
      date: new Date(cells[0]),
      note: cells[1] || -1,
      type: cells[2] || 'Autre',
      origin: cells[3] || 'Autre',
      comment: cells[4] || 'Aucun',
    };

    events.push({
      // use a constant unique ID to avoid messing up unique visitor count
      _id: 'AA814767-7B1F-5C81-8F1D-8E47AD7D2982',
      cdt: s.date.getTime(),
      e_a: s.comment,
      e_c: 'feedback:nps',
      e_n: `mood=${s.note}&type=${s.type}&origin=${s.origin}&date=${
        s.date.toISOString().split('T')[0]
      }`,
      e_v: 'nps',
    });
  });

matomo.trackBulk(events, (data) => {
  const d = JSON.parse(data);
  if (d['invalid']) {
    console.log('n° ' + index + ' failed');
  }
});
