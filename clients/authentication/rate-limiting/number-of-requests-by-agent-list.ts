import { readFromS3 } from '#clients/external-tooling/s3';
import { Information } from '#models/exceptions';
import { logInfoInSentry } from '#utils/sentry';

export type IMonitoringAgent = {
  Agent: string;
  'Past 10 minutes': number;
  'Past hour': number;
  'Past day': number;
  'Past week': number;
};

function parseCSV(csvString: string) {
  const lines = csvString.trim().split('\n');
  const headers = lines[0].split(',').map((header) => header.trim());

  const data = lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim());
    return {
      [headers[0]]: values[0],
      [headers[1]]: Number(values[1]),
      [headers[2]]: Number(values[2]),
      [headers[3]]: Number(values[3]),
      [headers[4]]: Number(values[4]),
    };
  });

  return data;
}

export const numberOfRequestByAgentList = async () => {
  const listAsString = await readFromS3('monitoring-comptes-agents');

  const list = parseCSV(listAsString) as IMonitoringAgent[];

  logInfoInSentry(
    new Information({
      name: 'RefreshingAgentMonitoringList',
      message: 'Refreshing list monitoring agent numbers of requests by period',
    })
  );
  return list;
};
