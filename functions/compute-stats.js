const https = require('https');

const get = (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = [];
        res.on('data', (chunk) => {
          data.push(chunk);
        });

        res.on('end', () => {
          const json = JSON.parse(Buffer.concat(data).toString());
          resolve(json);
        });
      })
      .on('error', (err) => {
        reject(err.message);
      });
  });
};

const post = (url, data) => {
  const postData = JSON.stringify(data);

  const options = {
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
      'content-Length': Buffer.byteLength(postData, 'utf8'),
      charset: 'utf-8',
    },
    timeout: 1000, // in ms
  };

  return new Promise((resolve, reject) => {
    var req = https.request(url, options, (res) => {
      console.log('statusCode:', res.statusCode);

      const body = [];
      res.on('data', (chunk) => body.push(chunk));
      res.on('end', () => {
        const resString = Buffer.concat(body).toString();
        resolve(resString);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData, 'utf8');
    req.end();
  });
};

/**
 * Compute stats and log them in mattermost
 * @param {*} event
 * @param {*} context
 * @returns
 */
exports.handle = function (event, context) {
  const d = new Date();
  d.setDate(d.getDate() - 1);

  const dateAsString = d.toISOString().split('T')[0];

  const url =
    'https://stats.data.gouv.fr/index.php?module=API&format=json&idSite=145&period=day&method=Events.getNameFromCategoryId&idSubtable=1&module=API&showColumns=label&filter_limit=9999&date=' +
    dateAsString;

  get(url)
    .then((res) => {
      const values = res.reduce((events, e) => {
        const rawVal = e.label.split('query=');
        if (rawVal.length === 2) {
          // only use events with query
          events.push({
            success: rawVal[0].indexOf('value=1') === 0,
            query: rawVal[1],
          });
        }
        return events;
      }, []);

      const count = values.length;
      const failRate = `${Math.floor(
        (values.filter((e) => !e.success).length / count) * 100
      )}%`;

      const test = `**Feedbacks dans la recherche [${dateAsString}]**\nNombre de feedbacks : ${count} \nFeedback négatifs : ${failRate} \nMots-clefs sans résultats satisfaisants : \n${values
        .filter((e) => !e.success)
        .map((e) => `- ${e.query}`)
        .join('\n')}`;

      const data = {
        username: 'clippy',
        text: test,
      };

      post(process.env.MATTERMOST_HOOK, data)
        .then((r) => console.log(r))
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));

  return {
    body: JSON.stringify({
      message: 'Success',
    }),
    statusCode: 200,
  };
};
// this.handle();
