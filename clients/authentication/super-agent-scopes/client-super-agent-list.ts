import { Information } from '#models/exceptions';
import { readFromS3 } from '#utils/integrations/s3';
import { logInfoInSentry } from '#utils/sentry';

export type IAgentRecord = {
  siret: string;
  email: string;
  scopes: string;
  actif: boolean;
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
