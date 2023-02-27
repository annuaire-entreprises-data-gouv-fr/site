import { AxiosRequestConfig } from 'axios';
import { httpGet } from '#utils/network';

export interface IODSResponse {
  records: {
    datasetid: string;
    recordid: string;
    fields: any;
  }[];
}

export interface IODSMetadata {
  datasets: { metas: { modified: string; data_processed: string } }[];
}

const extractLastModifiedDate = (metadata: IODSMetadata) => {
  if (!(metadata.datasets.length > 0)) {
    return null;
  }

  return metadata.datasets[0].metas.data_processed;
};

/**
 * Get results for searchTerms from Sirene ouverte API
 */
const odsClient = async (
  search: { url: string; config?: AxiosRequestConfig<any> },
  metaData: { url: string; config?: AxiosRequestConfig<any> }
): Promise<any> => {
  const [response, metadata] = await Promise.all([
    httpGet(search.url, search.config),
    httpGet(metaData.url, metaData.config),
  ]);

  const results = (response.data || []) as IODSResponse;

  const lastModified = extractLastModifiedDate(metadata.data);

  return {
    records: results.records.map((record) => record.fields),
    lastModified,
  };
};

export default odsClient;
