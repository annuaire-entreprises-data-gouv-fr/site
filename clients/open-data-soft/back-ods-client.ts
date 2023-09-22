import { AxiosRequestConfig } from 'axios';
import { httpGet } from '#utils/network';
import { IODSResponse } from './types';

/**
 * Request ODS - Only from backend
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

  const lastModified = responseMetaData?.metas?.metadata_processed || null;

  return {
    records: results.records.map((record) => record.fields),
    lastModified,
  };
};

export default odsClient;
