import routes from '#clients/routes';
import constants from '#models/constants';
import { Exception } from '#models/exceptions';
import httpClient from '#utils/network';
import logErrorInSentry from '#utils/sentry';

type IGristRecords = {
  records: {
    fields: any;
  }[];
};

const gristTables = {
  'nps-feedbacks': {
    docId: 'hp8PLhMGY9sNWuzGDGe6yi',
    tableId: 'NPS_Feedbacks',
  },
  'comptes-agents': {
    docId: 'hp8PLhMGY9sNWuzGDGe6yi',
    tableId: 'Comptes_agents',
  },
  'hide-personal-data': {
    docId: 'hp8PLhMGY9sNWuzGDGe6yi',
    tableId: 'Hide_personal_data_requests',
  },
  'agents-beta-testeurs': {
    docId: 'hp8PLhMGY9sNWuzGDGe6yi',
    tableId: 'Agents_beta_testeurs',
  },
  'logs-connexion': {
    docId: 'hp8PLhMGY9sNWuzGDGe6yi',
    tableId: 'Logs_connexion',
  },
} as const;

function getGristUrl(tableKey: keyof typeof gristTables) {
  const gristIds = gristTables[tableKey];

  if (!gristIds) {
    throw new Error(`${tableKey} is unknown, DOC ID and TABLE ID are required`);
  }
  if (!process.env.GRIST_API_KEY) {
    throw new Error('GRIST_API_KEY environment variable is not set');
  }
  return `${routes.tooling.grist}${gristIds.docId}/tables/${gristIds.tableId}/records`;
}

export async function logInGrist(
  tableKey: keyof typeof gristTables,
  data: unknown[]
) {
  try {
    await httpClient({
      method: 'POST',
      url: getGristUrl(tableKey),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.GRIST_API_KEY,
      },
      data: {
        records: data.map((d) => {
          return { fields: d };
        }),
      },
      timeout: constants.timeout.XXL,
    });
  } catch (error) {
    logErrorInSentry(new LogInGristException({ cause: error }));
    throw error;
  }
}

export async function readFromGrist(tableKey: keyof typeof gristTables) {
  try {
    const { records } = await httpClient<IGristRecords>({
      method: 'GET',
      url: getGristUrl(tableKey),
      headers: {
        Authorization: 'Bearer ' + process.env.GRIST_API_KEY,
      },
      timeout: constants.timeout.XXL,
    });

    return records.map((r) => r.fields);
  } catch (error) {
    logErrorInSentry(new ReadFromGristException({ cause: error }));
    throw error;
  }
}

class LogInGristException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      ...args,
      name: 'LogInGristException',
    });
  }
}

class ReadFromGristException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      ...args,
      name: 'ReadFromGristException',
    });
  }
}
