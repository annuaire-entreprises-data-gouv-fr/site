import constants from '#models/constants';
import { IDefaultRequestConfig, httpGet } from '#utils/network';
import { IODSMetadata, IODSResponse } from './types';

/**
 * Request ODS
 */
const odsClient = async (
  search: { url: string; config?: IDefaultRequestConfig },
  metaDataUrl: string
): Promise<any> => {
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
      'records' in results
        ? results.records.map((record) => record.fields)
        : results.results,
    lastModified,
  };
};

export default odsClient;
