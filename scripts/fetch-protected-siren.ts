import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Script that fetches the protected siren from the grist table
// and saves them under /public/protected-siren.txt
const DOC_ID = 'hp8PLhMGY9sNWuzGDGe6yi';
const TABLE_ID = 'Protected_siren';

if (!process.env.GRIST_API_KEY) {
  console.error(
    `[fetch-protected_siren]: Please set the GRIST_API_KEY environment variable`
  );
  process.exit(process.env.NODE_ENV !== 'production' ? 1 : 0);
}

console.log(
  `[fetch-protected_siren]: Fetching protected siren from Grist table...`
);
fetch(
  `https://grist.incubateur.net/api/docs/${DOC_ID}/tables/${TABLE_ID}/data`,
  {
    headers: {
      Authorization: 'Bearer ' + process.env.GRIST_API_KEY,
    },
  }
)
  .then((res) => res.json())
  .then((data) => {
    console.log(
      `[fetch-protected_siren]: Saving protected siren to /public/protected-siren.txt...`
    );
    const sirenString = data.siren.join('\n');
    fs.writeFileSync(
      path.join(__dirname, '../public/protected-siren.txt'),
      sirenString
    );
    console.log(`[fetch-protected_siren]: Done!`);
  })
  .catch((err) => {
    console.error(`[fetch-protected_siren]: ${err}`);
    process.exit(process.env.NODE_ENV !== 'production' ? 1 : 0);
  });
