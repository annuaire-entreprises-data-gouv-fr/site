import constants from "#models/constants";
import { httpGet, type IDefaultRequestConfig } from "#utils/network";
import type { IODSMetadata, IODSResponse } from "./types";

interface IODSClientResponse {
  lastModified: string | null;
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
  records: any[];
}

/**
 * Request ODS
 */
const odsClient = async (
  search: { url: string; config?: IDefaultRequestConfig },
  metaDataUrl: string
): Promise<IODSClientResponse> => {
  const timeout = constants.timeout.XXL;
  const [response, responseMetaData] = await Promise.all([
    httpGet<IODSResponse>(search.url, {
      timeout,
      ...search.config,
    }),
    httpGet<IODSMetadata>(metaDataUrl, { timeout }),
  ]);

  const results = response || [];

  const lastModified = responseMetaData?.metas?.metadata_processed || null;
  return {
    records:
      "records" in results
        ? results.records.map((record) => record.fields)
        : results.results,
    lastModified,
    meta: {
      page:
        results.parameters &&
        typeof results.parameters.start === "number" &&
        typeof results.parameters.rows === "number"
          ? Math.floor(results.parameters.start / results.parameters.rows) + 1
          : 1,
      page_size: results.parameters?.rows || 10,
      total: results.nhits || 0,
    },
  };
};

export default odsClient;
