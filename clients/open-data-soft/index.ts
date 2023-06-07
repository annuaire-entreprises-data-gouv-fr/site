import { AxiosRequestConfig } from 'axios';
import { httpGet } from '#utils/network';

export type IODSResponse = {
  records: {
    datasetid: string;
    recordid: string;
    fields: any;
  }[];
};

export type IODSMetadata = {
  metas: {
    modified: string;
    metadata_processed: string;
    data_processed: string;
  };
};

const extractLastModifiedDate = (metadata: IODSMetadata) => {
  return metadata?.metas?.metadata_processed || null;
};

/**
 * Get results for searchTerms from Sirene ouverte API
 */
const odsClient = async (
  search: { url: string; config?: AxiosRequestConfig<any> },
  metaDataUrl: string
): Promise<any> => {
  const [response, responseMetaData] = await Promise.all([
    httpGet(search.url, search.config),
    httpGet(metaDataUrl),
  ]);

  const results = (response.data || []) as IODSResponse;

  const lastModified = extractLastModifiedDate(responseMetaData.data);

  return {
    records: results.records.map((record) => record.fields),
    lastModified,
  };
};

export default odsClient;
