import type { Readable } from "node:stream";
import { StringDecoder } from "node:string_decoder";

/**
 * Number of rows requested per INSEE call.
 *
 * A single call returning up to 200 000 rows can exceed INSEE gateway
 * timeout, so the export is split into several shorter calls.
 */
export const CSV_PAGE_SIZE = 50_000;

/**
 * rows are sorted by SIRET and each page asks for the rows after the last SIRET
 * of the previous page.
 *
 * @param afterSiret last SIRET of the previous page, undefined for the first page
 */
export type FetchCsvPage = (afterSiret?: string) => Promise<Readable>;

// Exports start with siren, nic and siret columns, which are never quoted
const SIRET_AT_LINE_START = /^"?\d{9}"?,"?\d{5}"?,"?(\d{14})"?/;

const getSiret = (line: string) => SIRET_AT_LINE_START.exec(line)?.[1];

/**
 * Streams every page as a single CSV file: pages are fetched one after the
 * other, only once the previous one has been fully consumed, and the header
 * line of every page but the first is dropped.
 *
 * @param firstPage already fetched first page, so that errors on the first
 * call can still be reported with a proper HTTP status
 * @param total number of rows to export
 * @param pageSize number of rows requested per page
 */
export async function* streamCsvPages(
  fetchPage: FetchCsvPage,
  firstPage: Readable,
  total: number,
  pageSize = CSV_PAGE_SIZE
): AsyncGenerator<string> {
  let page: Readable | null = firstPage;
  let isFirstPage = true;
  let exportedRows = 0;

  while (page) {
    const decoder = new StringDecoder("utf8");
    let pending = "";
    let lineCount = 0;
    let lastLine = "";
    let headerSkipped = isFirstPage;

    const processLines = (text: string) => {
      let lines = text;
      if (!headerSkipped) {
        const headerEnd = lines.indexOf("\n");
        if (headerEnd === -1) {
          return "";
        }
        lines = lines.slice(headerEnd + 1);
        headerSkipped = true;
        lineCount += 1;
      }
      for (const line of lines.split("\n")) {
        if (line.trim()) {
          lastLine = line;
        }
      }
      lineCount += (lines.match(/\n/g) || []).length;
      return lines;
    };

    for await (const chunk of page) {
      const text = pending + decoder.write(chunk);
      const lastNewLine = text.lastIndexOf("\n");
      if (lastNewLine === -1) {
        pending = text;
        continue;
      }
      pending = text.slice(lastNewLine + 1);
      const lines = processLines(text.slice(0, lastNewLine + 1));
      if (lines) {
        yield lines;
      }
    }

    const rest = pending + decoder.end();
    if (rest.trim()) {
      const lines = processLines(`${rest}\n`);
      if (lines) {
        yield lines;
      }
    }

    // header line is not a row
    const pageRows = Math.max(lineCount - 1, 0);
    exportedRows += pageRows;
    isFirstPage = false;
    page = null;

    if (pageRows < pageSize || exportedRows >= total) {
      return;
    }

    const lastSiret = getSiret(lastLine);
    if (!lastSiret) {
      throw new Error("Could not read the last SIRET of an export CSV page");
    }
    page = await fetchPage(lastSiret);
  }
}
