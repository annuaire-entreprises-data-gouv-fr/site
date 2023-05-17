import crypto from 'crypto';
import { getAgentsFromNotion } from '#utils/integrations/notion';
import logErrorInSentry from '#utils/sentry';

/**
 * List of siren whose owner asked to be removed from website
 * See /public/authorized-agents.txt
 */
class AuthorizedAgentsList {
  public _list: string[] = [];

  getList = async () => {
    if (this._list.length === 0) {
      try {
        this._list = await getAgentsFromNotion();
      } catch (e: any) {
        logErrorInSentry('Error while fetching agent list from notion', {
          details: e.toString(),
        });
      }
    }
    return this._list;
  };
}

const authorizedAgents = new AuthorizedAgentsList();

export const isAuthorizedAgent = async (agentMail: string) => {
  const agentList = await authorizedAgents.getList();
  if (agentList.indexOf(agentMail) > -1) {
    return true;
  }
  return false;
};
