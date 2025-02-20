import { allAgentScopes, defaultAgentScopes } from '#models/user/agent-scopes';

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
