import { getSuperAgentsFromNotion } from '#utils/integrations/notion';
import logErrorInSentry from '#utils/sentry';

class SuperAgentsList {
  public _list: string[] = [];

  getList = async () => {
    if (this._list.length === 0) {
      try {
        this._list = await getSuperAgentsFromNotion();
      } catch (e: any) {
        logErrorInSentry(e, {
          errorName: 'Error while fetching agent list from notion',
        });
      }
    }
    return this._list;
  };
}

const superAgents = new SuperAgentsList();

export const checkIsSuperAgent = async (agentMail: string) => {
  const superAgentList = await superAgents.getList();
  if (superAgentList.indexOf(agentMail) > -1) {
    return true;
  }
  return false;
};
