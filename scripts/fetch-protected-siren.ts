/* eslint-disable no-console */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { isSiren } from '#utils/helpers';

// Script that fetches the protected siren from the grist table
// and saves them under /public/protected-siren.txt

const GRIST_DOC_ID = 'hp8PLhMGY9sNWuzGDGe6yi';
const GRIST_TABLE_ID = 'Protected_siren';

fetchAndSaveProtectedSiren();
async function fetchAndSaveProtectedSiren() {
  if (!process.env.GRIST_API_KEY) {
    console.error(
      `[fetch-protected_siren]: GRIST_API_KEY environment variable is not set`
    );
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  let protectedSiren: string[] | undefined;

  if (process.env.GRIST_API_KEY) {
    try {
      console.log(
        `[fetch-protected_siren]: Fetching protected siren from Grist table...`
      );
      protectedSiren = await fetchFromGrist();
      `[fetch-protected_siren]: Grist table successfully fetched`;
    } catch (err) {
      console.error(
        `[fetch-protected_siren]: Error fetching from grist table (${err})`
      );
    }
  }

  try {
    let currentlyDeployedProtectedSiren = await fetchFromCurrentlyDeployed();

    // If the protected siren fetched from Grist is shorter than the one
    if (
      protectedSiren &&
      protectedSiren.length < currentlyDeployedProtectedSiren.length
    ) {
      console.warn(
        `[fetch-protected_siren]: Table in Grist contains less protected siren than the currently deployed one.`
      );
      console.log(
        `[fetch-protected_siren]: Please check that no protected siren has been inadvertedly removed.`
      );
      protectedSiren = undefined;
    }
    if (!protectedSiren) {
      console.log(
        `[fetch-protected_siren]: Fallback to currently deployed protected siren`
      );
      protectedSiren = currentlyDeployedProtectedSiren;
    }
  } catch (err) {
    console.error(
      `[fetch-protected_siren]: Error fetching from currently deployed protected siren (${err})`
    );
  }

  if (!protectedSiren) {
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log(
        `[fetch-protected_siren]: Fallback to empty protected siren list (dev mode only)`
      );
      protectedSiren = [];
    }
  }

  fs.writeFileSync(
    path.join(__dirname, '../public/protected-siren.txt'),
    protectedSiren.join('\n')
  );

  console.log(`[fetch-protected_siren]: Done!`);
}

async function fetchFromGrist(): Promise<string[]> {
  const gristData = await (
    await fetch(
      `https://grist.incubateur.net/api/docs/${GRIST_DOC_ID}/tables/${GRIST_TABLE_ID}/records`,
      {
        headers: {
          Authorization: 'Bearer ' + process.env.GRIST_API_KEY,
        },
      }
    )
  ).json();

  if ('error' in gristData) {
    throw new Error(gristData.error);
  }
  const gristSiren = gristData.records
    .map((record: any) => record.fields.siren)
    .filter(Boolean)
    .map((number: number) => number.toString());

  if (!gristSiren.every(isSiren)) {
    throw new Error('some siren are not valid');
  }
  return gristSiren;
}

function fetchFromCurrentlyDeployed(): Promise<string[]> {
  return fetch(`https://annuaire-entreprises.data.gouv.fr/protected-siren.txt`)
    .then((res) => res.text())
    .then((text) => {
      const sirens = text.trim().split('\n');
      if (!sirens.every(isSiren)) {
        throw new Error('invalid response from annuaire-entreprises');
      }
      return sirens;
    });
}
