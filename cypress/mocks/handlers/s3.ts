import { allAgentScopes } from '#models/use-cases-scopes/all-agent-scopes';
import { HttpResponse, HttpResponseResolver } from 'msw';

export const s3Handler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json([
    {
      email: 'user@yopmail.com',
      scopes: allAgentScopes.join(' '),
      actif: true,
      'Date de création': '',
      'Instructeur/rice': 'Xavier',
      usage: 'Stack technique',
      siret: '13002526500013',
    },
  ]);
};
