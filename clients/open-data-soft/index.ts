import { httpGet } from '../../utils/network/http';

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
  searchUrl: string,
  metaDataUrl: string
): Promise<any> => {
  const [response, metadata] = await Promise.all([
    httpGet(searchUrl),
    httpGet(metaDataUrl),
  ]);

  const results = (response.data || []) as IODSResponse;

  const lastModified = extractLastModifiedDate(metadata.data);

  return {
    records: results.records.map((record) => record.fields),
    lastModified,
  };
};

export default odsClient;
