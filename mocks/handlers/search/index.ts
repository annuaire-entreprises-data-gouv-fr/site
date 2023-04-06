import { rest } from 'msw';
import { mockMapping } from 'mocks/utils';
import { resultEssSpectacle } from './result-ess-spectacle';
import { resultGrandParis } from './result-grand-paris';
import { resultRge } from './result-rge';
import { results } from './results';

export const handlers = [
  rest.get(
    'https://recherche-entreprises.api.gouv.fr/search',
    (_req, res, ctx) => {
      if (_req.url.searchParams.get('q') === mockMapping.rge) {
        return res(ctx.json(resultRge));
      }
      if (_req.url.searchParams.get('q') === mockMapping.essSpectacleVivant) {
        return res(ctx.json(resultEssSpectacle));
      }
      if (_req.url.searchParams.get('q') === mockMapping.grandParis) {
        return res(ctx.json(resultGrandParis));
      }
      return res(ctx.json(results));
    }
  ),
];
