import { superAgentsList } from '#clients/authentication/super-agent-list/agent-list';

export const getAdmin = async (slug: string) => {
  if (slug == 'super-agent-list') {
    return await superAgentsList.getAllAgents();
  }
  return [];
};
