import { rest } from 'msw';
import { mockMapping } from 'mocks/utils';
import { sireneNonDiffusible } from './sirene-non-diffusible';
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
    `https://api.insee.fr/entreprises/sirene/V3/siren/${mockMapping.essSpectacleVivant}`,
    (_req, res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${mockMapping.grandParis}`,
    (_req, res, ctx) => {
      return res(ctx.json({}));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${mockMapping.nonDiffusible}`,
    (_req, res, ctx) => {
      return res(ctx.json(sireneNonDiffusible));
    }
  ),
  rest.get(
    'https://api.insee.fr/entreprises/sirene/V3/siret',
    (_req, res, ctx) => {
      return res(ctx.json({}));
    }
  ),
];
