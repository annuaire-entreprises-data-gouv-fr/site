import crypto from 'crypto';
import { readFileSync } from 'fs';

/**
 * List of siren whose owner asked to be removed from website
 * See /public/authorized-agents.txt
 */
class AuthorizedAgentsList {
  public _list: string[] = [];

  constructor() {
    this._list = readFileSync('public/authorized-agents.txt', 'utf8').split(
      '\n'
    );
  }
}

const authorizedAgents = new AuthorizedAgentsList();

export const isAuthorizedAgent = (agentMail: string) => {
  const hashAgentMail = crypto
    .createHash('sha256')
    .update((agentMail || '').toLowerCase())
    .digest('hex');

  if (authorizedAgents._list.indexOf(hashAgentMail) > -1) {
    return true;
  }
  return false;
};
