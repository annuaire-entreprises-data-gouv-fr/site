import { rest } from 'msw';
import { association } from './association/manakin-production';
import { severnaya } from './imr/severnaya';
import { solutionEnergie } from './imr/solution-energie';

export const handlers = [
  rest.get(
    `https://rncs-proxy.api.gouv.fr/imr/${solutionEnergie.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(solutionEnergie));
    }
  ),
  rest.get(
    `https://rncs-proxy.api.gouv.fr/imr/${severnaya.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(severnaya));
    }
  ),
  rest.get(
    `https://rncs-proxy.api.gouv.fr/association/${association.identite.id_rna}`,
    (_req, res, ctx) => {
      return res(ctx.json(association));
    }
  ),
];
