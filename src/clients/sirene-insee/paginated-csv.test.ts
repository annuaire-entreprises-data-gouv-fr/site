import { Readable } from "node:stream";
import { vi } from "vitest";
import { streamCsvPages } from "./paginated-csv";

const PAGE_SIZE = 3;

const HEADER = "siren,nic,siret,denominationUniteLegale";

const row = (index: number) => {
  const siren = String(100_000_000 + index);
  const nic = "00012";
  return `${siren},${nic},${siren}${nic},"NOM, ${index}"`;
};

const page = (rows: number[]) =>
  [HEADER, ...rows.map(row)].map((line) => `${line}\n`).join("");

/** Splits the page in small chunks, to cut lines and multi-byte characters */
const toStream = (content: string, chunkSize = 7) => {
  const bytes = Buffer.from(content);
  const chunks: Buffer[] = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    chunks.push(bytes.subarray(i, i + chunkSize));
  }
  return Readable.from(chunks);
};

const collect = async (generator: AsyncGenerator<string>) => {
  let result = "";
  for await (const chunk of generator) {
    result += chunk;
  }
  return result;
};

describe("streamCsvPages", () => {
  it("returns a single page when it is not full", async () => {
    const fetchPage = vi.fn();

    const csv = await collect(
      streamCsvPages(fetchPage, toStream(page([1, 2])), 2, PAGE_SIZE)
    );

    expect(csv).toBe(page([1, 2]));
    expect(fetchPage).not.toHaveBeenCalled();
  });

  it("merges pages, keeping a single header and paging after the last SIRET", async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(toStream(page([4, 5, 6])))
      .mockResolvedValueOnce(toStream(page([7])));

    const csv = await collect(
      streamCsvPages(fetchPage, toStream(page([1, 2, 3])), 7, PAGE_SIZE)
    );

    expect(csv).toBe(page([1, 2, 3, 4, 5, 6, 7]));
    expect(fetchPage).toHaveBeenNthCalledWith(1, "10000000300012");
    expect(fetchPage).toHaveBeenNthCalledWith(2, "10000000600012");
  });

  it("stops once the expected total is reached", async () => {
    const fetchPage = vi.fn().mockResolvedValueOnce(toStream(page([4, 5, 6])));

    const csv = await collect(
      streamCsvPages(fetchPage, toStream(page([1, 2, 3])), 6, PAGE_SIZE)
    );

    expect(csv).toBe(page([1, 2, 3, 4, 5, 6]));
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it("handles a page without trailing new line and multi-byte characters", async () => {
    const firstPage = `${HEADER}\n${row(1)}\n${row(2)}\n100000003,00012,10000000300012,"ÉCOLE"`;
    const fetchPage = vi.fn().mockResolvedValueOnce(toStream(page([4]), 3));

    const csv = await collect(
      streamCsvPages(fetchPage, toStream(firstPage, 5), 10, PAGE_SIZE)
    );

    expect(csv).toBe(`${firstPage}\n${row(4)}\n`);
    expect(fetchPage).toHaveBeenCalledWith("10000000300012");
  });

  it("stops when the next page is empty", async () => {
    const fetchPage = vi.fn().mockResolvedValueOnce(Readable.from([]));

    const csv = await collect(
      streamCsvPages(fetchPage, toStream(page([1, 2, 3])), 10, PAGE_SIZE)
    );

    expect(csv).toBe(page([1, 2, 3]));
  });

  it("fails when the last SIRET cannot be read", async () => {
    const firstPage = `${HEADER}\na\nb\nc\n`;

    await expect(
      collect(streamCsvPages(vi.fn(), toStream(firstPage), 10, PAGE_SIZE))
    ).rejects.toThrow("Could not read the last SIRET");
  });
});
