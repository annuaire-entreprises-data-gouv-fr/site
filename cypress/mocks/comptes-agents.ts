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
  {
    email: 'with-too-many-requests@yopmail.com',
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

export const comptesAgentsMonitoring = [
  'Agent,Past 10 minutes,Past hour,Past day,Past week',
  'user@yopmail.com,0,0,0,0',
  'with-too-many-requests@yopmail.com,10000,10000,10000,10000',
  ...allAgentScopes.map((scope) => `${scope}@yopmail.com,0,0,0,0`),
].join('\n');
