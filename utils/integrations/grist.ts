import routes from '#clients/routes';
import httpClient from '#utils/network';

const gristTables = {
  'nps-feedbacks': {
    docId: 'hp8PLhMGY9sNWuzGDGe6yi',
    tableId: 'NPS_Feedbacks',
  },
} as { [tableKey: string]: { docId: string; tableId: string } };

function getGristUrl(tableKey: string) {
  const gristIds = gristTables[tableKey];

  if (!gristIds) {
    throw new Error(`${tableKey} is unknown, DOC ID and TABLE ID are required`);
  }
  if (!process.env.GRIST_API_KEY) {
    throw new Error('GRIST_API_KEY environment variable is not set');
  }
  return `${routes.tooling.grist}${gristIds.docId}/tables/${gristIds.tableId}/records`;
}

export async function logInGrist(tableKey: string, data: unknown[]) {
  await httpClient({
    method: 'POST',
    url: getGristUrl(tableKey),
    headers: {
      ContentType: 'application/json',
      Authorization: 'Bearer ' + process.env.GRIST_API_KEY,
    },
    data: {
      records: data.map((d) => {
        return { fields: d };
      }),
    },
  });
}

export async function readFromGrist(tableKey: string) {
  return await httpClient({
    method: 'GET',
    url: getGristUrl(tableKey),
    headers: {
      Authorization: 'Bearer ' + process.env.GRIST_API_KEY,
    },
  });
}
