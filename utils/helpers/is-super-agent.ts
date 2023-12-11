import { FetchRessourceException } from '#models/exceptions';
import { readFromGrist } from '#utils/integrations/grist';
import { logFatalErrorInSentry } from '#utils/sentry';

class SuperAgentsList {
  public _list: string[] = [];

  getList = async () => {
    if (this._list.length === 0) {
      try {
        const superAgents = await readFromGrist('comptes-agents');

        this._list = superAgents
          .filter((r: any) => r.actif === true)
          .map((r: any) => r.email);
      } catch (e: any) {
        logFatalErrorInSentry(
          new FetchRessourceException({
            ressource: 'SuperAgentsList',
            cause: e,
          })
        );
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
