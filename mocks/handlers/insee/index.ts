import { rest } from 'msw';
import { mockMapping } from 'mocks/utils';
import { token } from './token';

export const handlers = [
  rest.post('https://api.insee.fr/token', (_req, res, ctx) => {
    return res(ctx.json(token));
  }),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${mockMapping.rge}`,
    (_req, res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${mockMapping.ess}`,
    (_req, res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${mockMapping.spectacleVivant}`,
    (_req, res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(
    'https://api.insee.fr/entreprises/sirene/V3/siret',
    (_req, res, ctx) => {
      return res(ctx.json({}));
    }
  ),
];
