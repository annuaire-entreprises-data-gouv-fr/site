import { httpGet } from '#utils/network';
import { IODSMetadata, IODSResponse } from './types';

/**
 * Request ODS - Only from frontend
 */
const odsFrontClient = async (
  searchUrl: string,
  metaDataUrl: string
): Promise<any> => {
  const [response, responseMetaData] = await Promise.all([
    httpGet<IODSResponse>(searchUrl),
    httpGet<IODSMetadata>(metaDataUrl),
  ]);

  const results = (response || []) as IODSResponse;

  const lastModified = responseMetaData?.metas?.metadata_processed || null;

  return {
    records: results.records.map((record) => record.fields),
    lastModified,
  };
};

export default odsFrontClient;
