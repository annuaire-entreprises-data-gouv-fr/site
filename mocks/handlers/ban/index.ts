import { rest } from 'msw';
import { address } from './address';

export const handlers = [
  rest.get(`https://api-adresse.data.gouv.fr/search/`, (_req, res, ctx) => {
    return res(ctx.json(address));
  }),
];
