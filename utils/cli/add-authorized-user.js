const crypto = require('crypto');
const fs = require('fs');

process.argv.slice(2).forEach(function (val, index, array) {
  if (val.indexOf('@') === -1) {
    console.error(`❌ ${val} is not a valid email`);
    return;
  }

  const hash = crypto
    .createHash('sha256')
    .update((val || '').toLowerCase())
    .digest('hex');

  const list = fs
    .readFileSync('public/authorized-agents.txt', 'utf8')
    .split('\n')
    .filter((e) => !!e);

  const alreadyAuthorized = list.indexOf(hash) > -1;

  if (alreadyAuthorized) {
    console.error(`❌ ${val} is already an authorized user`);
  } else {
    fs.writeFileSync(
      'public/authorized-agents.txt',
      [...list, hash].join('\n')
    );
    console.info(`Nice 🌟 ! Already ${list.length + 1} users !`);
  }
});
