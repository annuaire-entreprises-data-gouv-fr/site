import {
  allAgentScopes,
  defaultAgentScopes,
} from '#models/authentication/agent/scopes';

export const comptesAgents = [
  {
    email: 'user@yopmail.com',
    scopes: allAgentScopes.join(' '),
    actif: true,
    'Date de création': '',
    'Instructeur/rice': 'Xavier',
    usage: 'Stack technique',
    siret: '13002526500013',
  },
  ...allAgentScopes.map((scope) => ({
    email: `${scope}@yopmail.com`,
    scopes: [...defaultAgentScopes, scope].join(' '),
    actif: true,
    'Date de création': '',
    'Instructeur/rice': 'Xavier',
    usage: 'Stack technique',
    siret: '13002526500013',
  })),
];

export const comptesAgentsMonitoring =
  'user@yopmail.com,10000,10000,10000,10000\n' +
  allAgentScopes
    .map((scope) => `${scope}@yopmail.com,10000,10000,10000,10000\n`)
    .join('');
