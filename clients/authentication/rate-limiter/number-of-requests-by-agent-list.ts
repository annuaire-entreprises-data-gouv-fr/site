import { readFromS3 } from "#clients/external-tooling/s3";
import { Information } from "#models/exceptions";
import { logInfoInSentry } from "#utils/sentry";

export type IAgentMonitoring = {
  email: string;
  rateLimits: IAgentRateLimits;
};

export type IAgentRateLimits = {
  tenMinutes: number;
  pastHour: number;
  pastDay: number;
  pastWeek: number;
};

function parseCSV(csvString: string) {
  const lines = csvString.trim().split("\n");
  const headers = lines[0].split(",").map((header) => header.trim());

  const data = lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const row: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    const output: IAgentMonitoring = {
      email: row["Agent"],
      rateLimits: {
        tenMinutes: parseInt(row["Past 10 minutes"], 10),
        pastHour: parseInt(row["Past hour"], 10),
        pastDay: parseInt(row["Past day"], 10),
        pastWeek: parseInt(row["Past week"], 10),
      },
    };
    return output;
  });

  return data;
}

export const numberOfRequestByAgentList = async () => {
  const listAsString = await readFromS3("monitoring-comptes-agents");

  const list = parseCSV(listAsString);

  logInfoInSentry(
    new Information({
      name: "RefreshingAgentMonitoringList",
      message: "Refreshing list monitoring agent numbers of requests by period",
    })
  );
  return list;
};
