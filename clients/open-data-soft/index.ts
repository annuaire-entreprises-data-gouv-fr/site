import { httpGet } from '../../utils/network/http';

export interface IODSResponse {
  records: {
    datasetid: string;
    recordid: string;
    fields: any;
  }[];
}

/**
 * Get results for searchTerms from Sirene ouverte API
 */
const odsClient = async (url: string): Promise<any> => {
  const response = await httpGet(url);
  const results = (response.data || []) as IODSResponse;

  return results.records.map((record) => record.fields);
};

export default odsClient;
