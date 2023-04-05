import { rest } from 'msw';
import { communes } from './communes';
import { departements } from './departements';

export const handlers = [
  rest.get('https://geo.api.gouv.fr/communes', (_req, res, ctx) => {
    return res(ctx.json(communes));
  }),
  rest.get('https://geo.api.gouv.fr/departements', (_req, res, ctx) => {
    return res(ctx.json(departements));
  }),
];
