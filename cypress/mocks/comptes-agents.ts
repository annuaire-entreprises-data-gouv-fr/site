import { allAgentScopes } from '#models/authentication/agent/scopes/constants';

export const comptesAgentsMonitoring = [
  'Agent,Past 10 minutes,Past hour,Past day,Past week',
  'user@yopmail.com,0,0,0,0',
  'with-too-many-requests@yopmail.com,10000,10000,10000,10000',
  ...allAgentScopes.map((scope) => `${scope}@yopmail.com,0,0,0,0`),
].join('\n');
