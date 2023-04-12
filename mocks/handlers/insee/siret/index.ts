import { rest } from 'msw';
import { ganymede } from './ganymede';

export const handlers = [
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siret/${ganymede.etablissement.siret}`,
    (_req, res, ctx) => {
      return res(ctx.json(ganymede));
    }
  ),
];
