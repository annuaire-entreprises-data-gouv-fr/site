import httpClient from '#utils/network';

const gristTables = {
  'nps-feedbacks': {
    docId: 'hp8PLhMGY9sNWuzGDGe6yi',
    tableId: 'NPS_Feedbacks',
  },
} as { [tableKey: string]: { docId: string; tableId: string } };

export async function logInGrist(tableKey: string, data: unknown[]) {
  const gristIds = gristTables[tableKey];

  if (!gristIds) {
    throw new Error(`${tableKey} is unknown, DOC ID and TABLE ID are required`);
  }
  if (!process.env.GRIST_API_KEY) {
    throw new Error('GRIST_API_KEY environment variable is not set');
  }
  const { docId, tableId } = gristIds;

  await httpClient({
    method: 'POST',
    url: `https://grist.incubateur.net/api/docs/${docId}/tables/${tableId}/records`,
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
