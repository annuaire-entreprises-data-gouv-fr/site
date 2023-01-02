import fs from 'fs';
import readline from 'readline';
import events from 'events';

export const readFileLineByLine = async (
  filePath: string,
  callback: (str: string) => void
) => {
  let count = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  rl.on('line', (line) => {
    callback(line);
    count++;
  });
  rl.on('error', (err) => console.error(err));

  await events.once(rl, 'close');
  return count;
};
