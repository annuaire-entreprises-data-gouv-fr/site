import httpFrontClient from '#utils/network/frontend';
import { IODSMetadata, IODSResponse } from './types';

/**
 * Request ODS - Only from frontend
 */
const odsFrontClient = async (
  searchUrl: string,
  metaDataUrl: string
): Promise<any> => {
  const [response, responseMetaData] = await Promise.all([
    httpFrontClient<IODSResponse>(searchUrl),
    httpFrontClient<IODSMetadata>(metaDataUrl),
  ]);

  const results = (response || []) as IODSResponse;

  const lastModified = responseMetaData?.metas?.metadata_processed || null;

  return {
    records: results.records.map((record) => record.fields),
    lastModified,
  };
};

export default odsFrontClient;
