import { validateEmail } from "#/components/espace-agent-components/helpers/form-validation";

export interface IParsedEmailsFile {
  alreadyInGroup: string[];
  duplicates: string[];
  emails: string[];
  invalid: string[];
}

const ACCEPTED_EXTENSIONS = [".txt", ".csv"];

export const isAcceptedEmailsFile = (file: File) =>
  ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

const normalizeEmail = (value: string) =>
  value.trim().replace(/^"|"$/g, "").trim().toLowerCase();

/**
 * Parse a .txt or .csv file with one email per line.
 * For csv, only the first column is kept and surrounding quotes are removed.
 * Emails are trimmed and lowercased before comparison and sending.
 */
export const parseEmailsFile = (
  content: string,
  groupEmails: string[]
): IParsedEmailsFile => {
  const groupEmailsSet = new Set(groupEmails.map(normalizeEmail));
  const seen = new Set<string>();
  const result: IParsedEmailsFile = {
    alreadyInGroup: [],
    duplicates: [],
    emails: [],
    invalid: [],
  };

  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const line of lines) {
    const email = normalizeEmail(line.split(/[,;]/)[0] ?? "");
    if (!email) {
      continue;
    }
    if (validateEmail(email)) {
      result.invalid.push(email);
      continue;
    }
    if (seen.has(email)) {
      result.duplicates.push(email);
      continue;
    }
    seen.add(email);
    if (groupEmailsSet.has(email)) {
      result.alreadyInGroup.push(email);
      continue;
    }
    result.emails.push(email);
  }

  return result;
};
