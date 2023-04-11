import { rest } from 'msw';
import { rge } from './rge';

export const handlers = [
  rest.get(
    `https://data.ademe.fr/data-fair/api/v1/datasets/liste-des-entreprises-rge-2/lines/`,
    (_req, res, ctx) => {
      if (_req.url.searchParams.get('qs')?.includes(rge.id)) {
        return res(ctx.json({ results: rge.results }));
      }
      return res(ctx.json({}));
    }
  ),
];
