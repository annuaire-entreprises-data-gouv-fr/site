import { rest } from 'msw';
import { handlers as sirenHandlers } from './siren';
import { handlers as siretHandlers } from './siret';
import { handlers as siretBySirenHandlers } from './siret-by-siren';
import { token } from './token';

export const handlers = [
  ...siretBySirenHandlers,
  ...sirenHandlers,
  ...siretHandlers,
  rest.post('https://api.insee.fr/token', (_req, res, ctx) => {
    return res(ctx.json(token));
  }),
];
