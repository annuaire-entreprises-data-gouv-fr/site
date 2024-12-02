/* eslint-disable no-console */
import routes from '#clients/routes';
import { isSiren } from '#utils/helpers';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Script that fetches the protected siren from the grist table
// and saves them under /public/protected-siren.txt

const GRIST_DOC_ID = 'hp8PLhMGY9sNWuzGDGe6yi';
const GRIST_TABLE_ID = 'Protected_siren';

fetchAndSaveProtectedSiren();

const failProcess = () => {
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    console.log(
      '[fetch-protected_siren]: dev-mode, ignoring error, empty list'
    );
  }
};

async function fetchAndSaveProtectedSiren() {
  let protectedSiren = [] as string[];
  console.log(`[fetch-protected_siren]: let's fetch protected siren`);
  if (!process.env.GRIST_API_KEY) {
    console.error(`[fetch-protected_siren]: GRIST_API_KEY missing`);
    failProcess();
  } else {
    try {
      protectedSiren = await fetchFromGrist();
      console.log(`[fetch-protected_siren]: Grist fetching success`);

      let oldProtectedSiren = await fetchCurrentProtectedList();
      const newSirenToOldRatio =
        protectedSiren.length / oldProtectedSiren.length;

      if (newSirenToOldRatio < 0.75) {
        throw new ProtectedSirenTooManySuppressionsError(
          `New list is only ${newSirenToOldRatio}% of previous list. Should not be less than 75%`
        );
      }
    } catch (err: any) {
      console.error(`[fetch-protected_siren]: Grist fetching failure (${err})`);

      // if grist is down one can manually activate fallback on current prod list to force deployment
      if (err instanceof ProtectedSirenGristFetchFailedError) {
      }
      if (err instanceof ProtectedSirenTooManySuppressionsError) {
      }
      if (err instanceof ProtectedSirenInvalidSirenError) {
      }
      failProcess();
    }
  }

  fs.writeFileSync(
    path.join(__dirname, '../public/protected-siren.txt'),
    protectedSiren.join('\n')
  );

  console.log(`[fetch-protected_siren]: Done!`);
}

/**
 * Fetchers functions
 */

async function fetchFromGrist(): Promise<string[]> {
  let gristSiren = [] as string[];
  try {
    const gristData = await (
      await fetch(
        `${routes.tooling.grist}${GRIST_DOC_ID}/tables/${GRIST_TABLE_ID}/records`,
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

    gristSiren = gristData.records
      .map((record: any) => record.fields.siren)
      .filter(Boolean)
      .map((number: number) => number.toString());
  } catch (e: any) {
    throw new ProtectedSirenGristFetchFailedError(e);
  }

  const invalidSiren = gristSiren.filter((s) => !isSiren(s));
  if (invalidSiren.length > 0) {
    throw new ProtectedSirenInvalidSirenError(invalidSiren.join(','));
  }

  return gristSiren;
}

/**
 * If Grist failed, fallback on production - do not use in production
 * @returns
 */
async function fetchCurrentProtectedList(): Promise<string[]> {
  return await fetch(
    `https://annuaire-entreprises.data.gouv.fr/protected-siren.txt`
  )
    .then((res) => res.text())
    .then((text) => {
      const sirens = text.trim().split('\n');
      const invalidSiren = sirens.filter((s) => !isSiren(s));
      if (invalidSiren.length > 0) {
        throw new ProtectedSirenGristFetchFailedError(invalidSiren.join(','));
      }
      return sirens;
    });
}

/**
 * Errors and exceptions
 */

class ProtectedSirenInvalidSirenError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'At least one protected siren is invalid';
  }
}

class ProtectedSirenGristFetchFailedError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'Grist fetch failed';
  }
}

class ProtectedSirenTooManySuppressionsError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'Too many siren deletion compared to current list';
  }
}
