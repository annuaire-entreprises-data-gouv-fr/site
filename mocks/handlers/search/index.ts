import { rest } from 'msw';
import { mockMapping } from 'mocks/utils';
import { resultRge } from './result-rge';
import { results } from './results';

export const handlers = [
  rest.get(
    'https://recherche-entreprises.api.gouv.fr/search',
    (_req, res, ctx) => {
      if (_req.url.searchParams.get('q') === mockMapping.rge) {
        return res(ctx.json(resultRge));
      }
      if (_req.url.searchParams.get('q') === mockMapping.spectacleVivant) {
        return undefined;
      }
      if (_req.url.searchParams.get('q') === mockMapping.ess) {
        return undefined;
      }
      return res(ctx.json(results));
    }
  ),
];
