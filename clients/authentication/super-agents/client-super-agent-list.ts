import { readFromS3 } from '#clients/external-tooling/s3';
import { Information } from '#models/exceptions';
import { logInfoInSentry } from '#utils/sentry';

export type IAgentRecord = {
  siret: string;
  email: string;
  scopes: string;
  actif: boolean;
  usage: string;
};

export const clientSuperAgentList = async () => {
  const listAsString = await readFromS3('comptes-agents');

  const list = JSON.parse(listAsString) as IAgentRecord[];

  logInfoInSentry(
    new Information({
      name: 'RefreshingSuperAgentList',
      message: 'Refreshing list of every super agents and their rights',
    })
  );
  return list;
};
