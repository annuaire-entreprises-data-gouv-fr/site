const fs = require('fs');
const readline = require('readline');
const events = require('events');

module.exports.readFileLineByLine = async (filePath, callback) => {
  let count = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  rl.on('line', (line) => {
    callback(line);
    count++;
  });
  rl.on('error', (err) => console.log(err));

  await events.once(rl, 'close');
  return count;
};
