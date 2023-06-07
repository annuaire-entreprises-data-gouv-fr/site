import { rest } from 'msw';
import { dataset } from './dataset';
import { records } from './records';

export const handlers = [
  rest.get(
    'https://data.culture.gouv.fr/api/datasets/1.0/',
    (_req, res, ctx) => {
      return res(ctx.json(dataset));
    }
  ),
  rest.get(
    'https://data.culture.gouv.fr/api/records/1.0/search/',
    (_req, res, ctx) => {
      return res(ctx.json(records));
    }
  ),
];
