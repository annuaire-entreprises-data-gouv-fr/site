import { rest } from 'msw';
import { mockMapping } from 'mocks/utils';
import { association } from './association';
import { imr } from './imr';

export const handlers = [
  rest.get(
    `https://rncs-proxy.api.gouv.fr/imr/${mockMapping.rge}`,
    (_req, res, ctx) => {
      return res(ctx.json(imr));
    }
  ),
  rest.get(
    `https://rncs-proxy.api.gouv.fr/association/${mockMapping.association}`,
    (_req, res, ctx) => {
      return res(ctx.json(association));
    }
  ),
];
